import { Injectable, Logger, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      this.logger.log(`Creating customer with email: ${createCustomerDto.email}`);
      const customer = this.customerRepository.create(createCustomerDto);
      const savedCustomer = await this.customerRepository.save(customer);
      this.logger.log(`Customer created successfully with ID: ${savedCustomer.id}`);
      return savedCustomer;
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error.message}`, error.stack);
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new ConflictException('This email address is already registered');
        }
        if (error.detail.includes('phone')) {
          throw new ConflictException('This phone number is already registered');
        }
      }
      throw new InternalServerErrorException('We encountered an issue while creating your account. Please try again later.');
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      this.logger.log('Retrieving all customers');
      return this.customerRepository.find();
    } catch (error) {
      this.logger.error(`Failed to retrieve customers: ${error.message}`, error.stack);
      throw new InternalServerErrorException('We encountered an issue while retrieving customers. Please try again later.');
    }
  }

  async findOne(id: string): Promise<Customer> {
    try {
      this.logger.debug(`Looking up customer with ID: ${id}`);
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        this.logger.warn(`Customer ${id} not found in database`);
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      this.logger.debug(`Found customer: ${JSON.stringify(customer)}`);
      return customer;
    } catch (error) {
      this.logger.error(`Database error finding customer ${id}:`, error.stack);
      throw new InternalServerErrorException('We encountered an issue while retrieving the customer. Please try again later.');
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      this.logger.log(`Updating customer with ID: ${id}`);
      const customer = await this.findOne(id);
      Object.assign(customer, updateCustomerDto);
      const updatedCustomer = await this.customerRepository.save(customer);
      this.logger.log(`Customer updated successfully with ID: ${updatedCustomer.id}`);
      return updatedCustomer;
    } catch (error) {
      this.logger.error(`Failed to update customer: ${error.message}`, error.stack);
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new ConflictException('This email address is already registered');
        }
        if (error.detail.includes('phone')) {
          throw new ConflictException('This phone number is already registered');
        }
      }
      throw new InternalServerErrorException('We encountered an issue while updating the customer. Please try again later.');
    }
  }

  async addOrderToCustomer(customerId: string, orderId: string): Promise<void> {
    try {
      this.logger.log(`Adding order to customer with ID: ${customerId}`);
      const customer = await this.findOne(customerId);
      if (!customer.orderIds) customer.orderIds = [];
      if (!customer.orderIds.includes(orderId)) {
        customer.orderIds.push(orderId);
        await this.customerRepository.save(customer);
        this.logger.log(`Order added successfully to customer with ID: ${customerId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to add order to customer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('We encountered an issue while adding the order to the customer. Please try again later.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing customer with ID: ${id}`);
      const customer = await this.findOne(id);
      await this.customerRepository.remove(customer);
      this.logger.log(`Customer removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to remove customer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('We encountered an issue while removing the customer. Please try again later.');
    }
  }
}
