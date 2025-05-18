import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport, ClientProvider } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppLogger } from './logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(AppLogger);
  logger.setContext('Bootstrap');

  // Apply global pipes and filters
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Service API')
    .setDescription('API documentation for the Customer microservice')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL') ?? 'amqp://localhost:5672'] as string[],
      queue: 'customer_queue',
      queueOptions: {
        durable: true
      },
    }
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3003
    }
  } as ClientProvider);

  await app.startAllMicroservices();
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`Customer service is running on port ${port}`);
  logger.log(`Swagger UI available at /api`);
}
bootstrap();
