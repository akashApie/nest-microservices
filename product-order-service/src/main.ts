import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppLogger } from './logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(AppLogger);

  // Setup Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product-Order Service API')
    .setDescription('API documentation for the Product and Order microservice')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Connect microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URI')],
      queue: configService.get<string>('RABBITMQ_QUEUE'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  logger.log(`Product-Order service is running on port ${port}`);
  logger.log(`Swagger UI available at /api`);
}
bootstrap();
