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
        urls: [configService.get<string>('RABBITMQ_URI')],
        queue: configService.get<string>('RABBITMQ_QUEUE'),
        queueOptions: { durable: true },
      },
    }),
  },
]);
