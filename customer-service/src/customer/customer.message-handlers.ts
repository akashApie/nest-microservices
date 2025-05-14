import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomerService } from './customer.service';

@Controller()
export class CustomerMessageHandlers {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('get_customer_by_id')
  async getCustomerById(customerId: string) {
    try {
      const customer = await this.customerService.findOne(customerId);
      return customer;
    } catch (error) {
      // Return null if customer not found, allowing the requester to handle this case
      return null;
    }
  }

  @MessagePattern('check_customer_exists')
  async checkCustomerExists(customerId: string) {
    try {
      await this.customerService.findOne(customerId);
      return true;
    } catch (error) {
      return false;
    }
  }

  @MessagePattern('order_created')
  async handleOrderCreated(orderData: any) {
    // orderData should contain: id (orderId), customerId
    if (!orderData?.customerId || !orderData?.id) return;
    await this.customerService.addOrderToCustomer(orderData.customerId, orderData.id);
  }
}
