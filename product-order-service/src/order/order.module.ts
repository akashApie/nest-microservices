import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderMessageHandlers } from './order.message-handlers';
import { RabbitMQModule } from '../messaging/rabbitmq.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    RabbitMQModule,
    HttpModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule
  ],
  controllers: [OrderController, OrderMessageHandlers],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
