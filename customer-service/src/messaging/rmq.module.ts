import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqClientModule } from './rmq-client.provider';

@Module({
  imports: [
    RmqClientModule,
    ClientsModule.registerAsync([
      {
        name: 'CUSTOMER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'customer_queue',
            queueOptions: { 
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'customer_dlx',
                'x-dead-letter-routing-key': 'customer_dlq',
              },
            },
          },
        }),
      },
    ]),
  ],
  exports: [RmqClientModule, 'CUSTOMER_SERVICE'],
})
export class RmqModule {}
