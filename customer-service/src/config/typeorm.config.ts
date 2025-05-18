import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Customer } from '../customer/entities/customer.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DB_PORT','5433') , 10),
  username: configService.get<string>('DB_USERNAME') || 'customer_user',
  password: configService.get<string>('DB_PASSWORD') || 'customer_pass',
  database: configService.get<string>('DB_NAME') || 'customer_db',
  entities: [Customer],
  synchronize: false,
  autoLoadEntities: true,
});
