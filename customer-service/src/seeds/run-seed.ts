import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { initialDataSeed } from './initial-data.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.create(AppModule);
  
  try {
    const dataSource = app.get(DataSource);
    logger.log('Starting seeding process...');
    await initialDataSeed(dataSource);
    logger.log('Seeding completed!');
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`, error.stack);
  } finally {
    await app.close();
  }
}

bootstrap();
