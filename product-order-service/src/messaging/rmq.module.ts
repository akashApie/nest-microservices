import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqClientModule } from './rmq-client.provider';

@Module({
  imports: [
    RmqClientModule,
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'order_queue',
            queueOptions: { 
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'order_dlx',
                'x-dead-letter-routing-key': 'order_dlq',
              },
            },
          },
        }),
      },
    ]),
  ],
  exports: [RmqClientModule, 'ORDER_SERVICE'],
})
export class RmqModule {}
