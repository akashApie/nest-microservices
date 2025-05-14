import { DataSource } from 'typeorm';
import { Customer } from './src/customer/entities/customer.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.development') });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer],
  migrations: [path.join(__dirname, '/src/migrations/*.{ts,js}')],
  synchronize: false,
});

