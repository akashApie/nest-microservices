import { Injectable, NotFoundException, BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderCreatedEvent } from '../messaging/events/order-events';
import { CustomerCreatedEvent, CustomerUpdatedEvent } from '@customer-service/messaging/events/customer-events';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verify customer exists in Customer service
    // const customerExists = await this.verifyCustomer(createOrderDto.customerId);
    // if (!customerExists) {
    //   throw new BadRequestException(`Customer with ID ${createOrderDto.customerId} not found`);
    // }
    
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
    // this.client.emit('order_created', {
    //   id: savedOrder.id,
    //   customerId: savedOrder.customerId,
    //   status: savedOrder.status,
    //   totalAmount: savedOrder.totalAmount,
    //   orderDate: savedOrder.orderDate
    // });
    
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

  // Find orders by customer ID
  async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
    this.logger.log(`Finding orders for customer: ${customerId}`);
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items', 'items.product'],
      order: { orderDate: 'DESC' }
    });
  }

  // Customer event handling methods
  async processCustomerCreated(customerData: CustomerCreatedEvent): Promise<void> {
    // (Optional) Store minimal customer info locally if you want denormalized data
    this.logger.log(`Processing customer created: ${JSON.stringify(customerData)}`);
    // In a production app, you might store denormalized customer data
    // Example: await this.customerRepository.save({ id: customerData.id, name: customerData.name });
  }

  async processCustomerUpdated(customerData: CustomerUpdatedEvent): Promise<void> {
    // (Optional) Update denormalized customer data in orders
    this.logger.log(`Processing customer updated: ${JSON.stringify(customerData)}`);
    // Example: await this.orderRepository.update({ customerId: customerData.id }, { customerName: customerData.name });
  }

  async processCustomerDeleted(customerId: string): Promise<void> {
    // Mark all orders for this customer as 'customer-deleted'
    this.logger.log(`Processing customer deleted, customerId: ${customerId}`);
    await this.orderRepository.update(
      { customerId },
      { status: 'customer-deleted' }
    );
  }

    async verifyCustomer(customerId: string): Promise<boolean> {
      try {
        const response = await this.httpService.get(`http://localhost:3003/customers/${customerId}/verify`).toPromise();
        console.log('response', response);
        return response?.data.exists;
      } catch (error) {
        this.logger.error('Error verifying customer:', error);
        return false;
      }
    }
}
