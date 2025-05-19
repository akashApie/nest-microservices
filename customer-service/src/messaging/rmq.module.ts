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
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RMQ_URL') ?? 'amqp://localhost:5672'],
            queue: 'customer_queue',
            noAck: false,
            prefetchCount: 1,
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'orders.dlx',
                'x-message-ttl': 60000,
                'x-dead-letter-routing-key': 'customer_queue.dead'
              }
            },
            socketOptions: {
              heartbeatIntervalInSeconds: 60,
              reconnectTimeInSeconds: 5
            }
          }
        })
      },
    ]),
  ],
  exports: [RmqClientModule, ClientsModule],
})
export class RmqModule {}
