import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
    ProductModule,
    OrderModule,
    ClientsModule.register([{
      name: 'CUSTOMER_SERVICE',
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001
      }
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
