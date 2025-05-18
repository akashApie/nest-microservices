import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppLogger } from './logger/logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RabbitMQModule } from './messaging/rabbitmq.module';

@Module({
  imports: [
    RabbitMQModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ProductModule,
    OrderModule,
    ClientsModule.register([{
      name: 'CUSTOMER_SERVICE',
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4001
      }
    }]),
  ],
  controllers: [AppController],
  providers: [AppService, AppLogger, {
    provide: AllExceptionsFilter,
    useClass: AllExceptionsFilter
  }],
})
export class AppModule {}
