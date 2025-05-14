import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderMessageHandlers {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('customer_created')
  async handleCustomerCreated(data: any) {
    console.log('Customer created event received in Order service:', data);
    // Store minimal customer data if needed or process event
    await this.orderService.processCustomerCreated(data);
  }

  @EventPattern('customer_updated')
  async handleCustomerUpdated(data: any) {
    console.log('Customer updated event received in Order service:', data);
    // Update any local customer data if storing denormalized data
    await this.orderService.processCustomerUpdated(data);
  }

  @EventPattern('customer_deleted')
  async handleCustomerDeleted(data: any) {
    console.log('Customer deleted event received in Order service:', data);
    // Handle customer deletion in orders if needed
    await this.orderService.processCustomerDeleted(data.id);
  }
}
