import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CustomerCreatedEvent, CustomerUpdatedEvent, CustomerDeletedEvent, CUSTOMER_EVENTS } from '../messaging/events/customer-events';

@Controller()
export class OrderMessageHandlers {
  private readonly logger = new Logger(OrderMessageHandlers.name);
  
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(CUSTOMER_EVENTS.CUSTOMER_CREATED)
  async handleCustomerCreated(data: CustomerCreatedEvent) {
    try {
      this.logger.log(`Customer created event received: ${JSON.stringify(data)}`);
      await this.orderService.processCustomerCreated(data);
    } catch (error) {
      this.logger.error(`Error processing customer created event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(CUSTOMER_EVENTS.CUSTOMER_UPDATED)
  async handleCustomerUpdated(data: CustomerUpdatedEvent) {
    try {
      this.logger.log(`Customer updated event received: ${JSON.stringify(data)}`);
      await this.orderService.processCustomerUpdated(data);
    } catch (error) {
      this.logger.error(`Error processing customer updated event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(CUSTOMER_EVENTS.CUSTOMER_DELETED)
  async handleCustomerDeleted(data: CustomerDeletedEvent) {
    try {
      this.logger.log(`Customer deleted event received: ${JSON.stringify(data)}`);
      await this.orderService.processCustomerDeleted(data.id);
    } catch (error) {
      this.logger.error(`Error processing customer deleted event: ${error.message}`, error.stack);
    }
  }
  
  @MessagePattern('get_orders_by_customer_id')
  async getOrdersByCustomerId(customerId: string) {
    try {
      return await this.orderService.findOrdersByCustomerId(customerId);
    } catch (error) {
      this.logger.error(`Error fetching orders for customer ${customerId}: ${error.message}`, error.stack);
      return [];
    }
  }
}
