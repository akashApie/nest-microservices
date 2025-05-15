import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { OrderCreatedEvent, OrderUpdatedEvent, ORDER_EVENTS } from '../messaging/events/customer-events';

@Controller()
export class CustomerMessageHandlers {
  private readonly logger = new Logger(CustomerMessageHandlers.name);

  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('get_customer_by_id')
  async getCustomerById(customerId: string) {
    try {
      this.logger.log(`Retrieving customer with ID: ${customerId}`);
      const customer = await this.customerService.findOne(customerId);
      return customer;
    } catch (error) {
      this.logger.warn(`Customer with ID ${customerId} not found`);
      // Return null if customer not found, allowing the requester to handle this case
      return null;
    }
  }

  @MessagePattern('check_customer_exists')
  async checkCustomerExists(customerId: string) {
    try {
      this.logger.log(`Checking if customer exists: ${customerId}`);
      await this.customerService.findOne(customerId);
      return true;
    } catch (error) {
      this.logger.warn(`Customer with ID ${customerId} does not exist`);
      return false;
    }
  }

  @EventPattern(ORDER_EVENTS.ORDER_CREATED)
  async handleOrderCreated(orderData: OrderCreatedEvent) {
    try {
      this.logger.log(`Order created event received: ${JSON.stringify(orderData)}`);
      // orderData should contain: id (orderId), customerId
      if (!orderData?.customerId || !orderData?.id) {
        this.logger.warn('Invalid order data received, missing customerId or id');
        return;
      }
      await this.customerService.addOrderToCustomer(orderData.customerId, orderData.id);
      this.logger.log(`Order ${orderData.id} added to customer ${orderData.customerId}`);
    } catch (error) {
      this.logger.error(`Error processing order created event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(ORDER_EVENTS.ORDER_UPDATED)
  async handleOrderUpdated(orderData: OrderUpdatedEvent) {
    try {
      this.logger.log(`Order updated event received: ${JSON.stringify(orderData)}`);
      // In a real-world scenario, you might update order status in customer service
      // if you're storing denormalized order data
    } catch (error) {
      this.logger.error(`Error processing order updated event: ${error.message}`, error.stack);
    }
  }
}
