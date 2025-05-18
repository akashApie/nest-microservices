import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, ClientProvider } from '@nestjs/microservices';
import { RmqClientModule } from './rmq-client.provider';

@Module({
  imports: [
    RmqClientModule,
    ClientsModule.registerAsync([
      {
        name: 'CUSTOMER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        // customer-service/src/messaging/rmq.module.ts
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RMQ_URL') ?? 'amqp://localhost:5672'] as string[],
            queue: 'customer_queue',
            queueOptions: { 
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'customer_dlx',
                'x-dead-letter-routing-key': 'customer_dlq'
              }
            }
          }
        })
      },
    ]),
  ],
  exports: [RmqClientModule, 'CUSTOMER_SERVICE'],
})
export class RmqModule {}
