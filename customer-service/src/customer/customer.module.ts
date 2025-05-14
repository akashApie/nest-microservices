import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerMessageHandlers } from './customer.message-handlers';
import { RmqClientModule } from '../messaging/rmq-client.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    RmqClientModule
  ],
  controllers: [CustomerController, CustomerMessageHandlers],
  providers: [CustomerService],
  exports: [TypeOrmModule, CustomerService],
})
export class CustomerModule {}
