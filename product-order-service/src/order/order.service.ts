import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('RMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verify customer exists in Customer service
    const customerExists = await this.verifyCustomer(createOrderDto.customerId);
    if (!customerExists) {
      throw new BadRequestException(`Customer with ID ${createOrderDto.customerId} not found`);
    }
    
    // Validate and fetch products
    const items: OrderItem[] = [];
    let totalAmount = 0;
    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) throw new BadRequestException(`Product ${itemDto.productId} not found`);
      if (product.stock < itemDto.quantity) throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      product.stock -= itemDto.quantity;
      await this.productRepository.save(product);
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });
      totalAmount += itemDto.quantity * itemDto.price;
      items.push(orderItem);
    }
    
    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      orderDate: new Date(),
      status: createOrderDto.status || 'pending',
      totalAmount,
      items,
    });
    
    const savedOrder = await this.orderRepository.save(order);
    
    // Emit order created event
    this.client.emit('order_created', {
      id: savedOrder.id,
      customerId: savedOrder.customerId,
      status: savedOrder.status,
      totalAmount: savedOrder.totalAmount,
      orderDate: savedOrder.orderDate
    });
    
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.product'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'items.product'] });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  // Customer event handling methods
  async processCustomerCreated(customerData: any): Promise<void> {
    // Process customer created event
    // For example, you might want to store minimal customer info in a local table
    // This implementation depends on your specific requirements
    console.log('Processing customer created:', customerData);
  }

  async processCustomerUpdated(customerData: any): Promise<void> {
    // Process customer updated event
    // Update any local customer data if you're storing denormalized data
    console.log('Processing customer updated:', customerData);
    
    // Example: Update customer name in orders if you store it denormalized
    // await this.orderRepository.update(
    //   { customerId: customerData.id },
    //   { customerName: customerData.name }
    // );
  }

  async processCustomerDeleted(customerId: string): Promise<void> {
    // Process customer deleted event
    // This might involve marking orders as orphaned or implementing a specific business logic
    console.log('Processing customer deleted, customerId:', customerId);
    
    // Example: Mark orders as 'customer-deleted' or handle according to business rules
    // await this.orderRepository.update(
    //   { customerId },
    //   { status: 'customer-deleted' }
    // );
  }
  
  async verifyCustomer(customerId: string): Promise<boolean> {
    // Use RabbitMQ client to check if customer exists in Customer service
    try {
      return await this.client.send('check_customer_exists', customerId).toPromise();
    } catch (error) {
      console.error('Error verifying customer:', error);
      return false;
    }
  }
}
