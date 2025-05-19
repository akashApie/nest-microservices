import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { RmqModule } from '../messaging/rmq.module';
import { OrderCreatedConsumer } from '../consumers/order-created.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    RmqModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, OrderCreatedConsumer],
  exports: [CustomerService]
})
export class CustomerModule {}
