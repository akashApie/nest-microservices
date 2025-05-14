import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @Inject('RMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    const savedCustomer = await this.customerRepository.save(customer);
    
    // Emit customer_created event
    this.client.emit('customer_created', {
      id: savedCustomer.id,
      name: savedCustomer.name,
      email: savedCustomer.email,
    });
    
    return savedCustomer;
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    const updatedCustomer = await this.customerRepository.save(customer);
    
    // Emit customer_updated event
    this.client.emit('customer_updated', {
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
    });
    
    return updatedCustomer;
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    
    // Store customer details before removal
    const customerDetails = { id: customer.id };
    
    await this.customerRepository.remove(customer);
    
    // Emit customer_deleted event
    this.client.emit('customer_deleted', customerDetails);
  }
}
