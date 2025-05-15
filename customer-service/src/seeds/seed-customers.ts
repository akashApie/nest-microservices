import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Customer } from '../customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const customerRepo = app.get<Repository<Customer>>(getRepositoryToken(Customer));

  const customers = [
    { name: 'Alice Smith', email: 'alice@example.com', address: '123 Main St' },
    { name: 'Bob Johnson', email: 'bob@example.com', address: '456 Oak Ave' },
    { name: 'Charlie Brown', email: 'charlie@example.com', address: '789 Pine Rd' },
  ];

  for (const data of customers) {
    const exists = await customerRepo.findOne({ where: { email: data.email } });
    if (!exists) {
      await customerRepo.save(customerRepo.create(data));
      console.log(`Inserted customer: ${data.name}`);
    } else {
      console.log(`Customer already exists: ${data.email}`);
    }
  }

  await app.close();
  console.log('Customer seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
