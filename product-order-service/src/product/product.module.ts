import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { RmqClientModule } from '../messaging/rmq-client.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    RmqClientModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
