import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { CustomerService } from '../customer/customer.service';

@Controller()
export class OrderConsumer {
  constructor(private readonly customerService: CustomerService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    // Update customer's order history
    await this.customerService.addOrderToHistory(
      data.customerId,
      {
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        createdAt: data.createdAt
      }
    );
  }
}
