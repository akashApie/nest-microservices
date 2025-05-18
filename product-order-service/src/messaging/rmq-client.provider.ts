import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const RmqClientModule = ClientsModule.registerAsync([
  {
    name: 'RMQ_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
  transport: Transport.RMQ,
  options: {
    urls: [configService.get<string>('RMQ_URL') ?? 'amqp://localhost:5672'], // Default fallback
    queue: configService.get<string>('RMQ_QUEUE_NAME') ?? 'customer_queue',
    queueOptions: { durable: true }
  }
}),
  },
]);
