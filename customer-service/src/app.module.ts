import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLogger } from './logger/logger.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    CustomerModule,
    ClientsModule.register([{
      name: 'PRODUCT_SERVICE',
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002
      }
    }]),
  ],
  controllers: [AppController],
  providers: [AppService,AppLogger],
})
export class AppModule {}
