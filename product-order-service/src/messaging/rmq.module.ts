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
    urls: [configService.get<string>('RMQ_URL') ?? 'amqp://localhost:5672'] as string[],
    queue: configService.get<string>('RMQ_QUEUE_NAME') ?? 'customer_queue',
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dead_letters',
        'x-dead-letter-routing-key': 'dead_letters'
      }
    }
  }
}),
      },
    ]),
  ],
  exports: [RmqClientModule, 'ORDER_SERVICE'],
})
export class RmqModule {}
