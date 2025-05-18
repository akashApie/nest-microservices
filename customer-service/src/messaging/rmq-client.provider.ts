import { ClientsModule, Transport, ClientProvider } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const RmqClientModule = ClientsModule.registerAsync([
  {
    name: 'RMQ_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): ClientProvider => ({
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
]);
