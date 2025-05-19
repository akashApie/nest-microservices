import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class OrderCreatedConsumer {
  private readonly logger = new Logger(OrderCreatedConsumer.name);
  private readonly MAX_RETRIES = 3;

  constructor(private readonly customerService: CustomerService) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(payload: OrderCreatedEvent) {
    let attempts = 0;
    
    while (attempts < this.MAX_RETRIES) {
      try {
        await this.customerService.addOrderToHistory(
          payload.customerId,
          {
            orderId: payload.orderId,
            totalAmount: payload.totalAmount,
            createdAt: payload.createdAt
          }
        );
        return; // Success - exit loop
      } catch (error) {
        attempts++;
        this.logger.error(
          `Failed to process order ${payload.orderId} (attempt ${attempts}/${this.MAX_RETRIES}): ${error.message}`,
          error.stack
        );
        
        if (attempts >= this.MAX_RETRIES) {
          throw error; // Re-throw after final attempt
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, attempts))
        );
      }
    }
  }
}
