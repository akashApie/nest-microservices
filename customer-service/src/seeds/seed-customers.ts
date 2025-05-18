import { createConnection, getConnection } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';

export async function seed() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'thankyougod',
    database: process.env.DB_NAME || 'customer_db',
    entities: [Customer],
    synchronize: false,
  });

  const customerRepository = connection.getRepository(Customer);

  // Clear existing data
  await customerRepository.clear();
  console.log('Cleared existing customer data');

  const testCustomers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      address: '456 Oak Ave, Somewhere',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      address: '789 Pine Rd, Nowhere',
    },
    {
      name: 'Alice Williams',
      email: 'alice.w@example.com',
      address: '321 Elm Blvd, Anycity',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      address: '654 Maple Dr, Somecity',
    },
    {
      name: 'Diana Prince',
      email: 'diana.p@example.com',
      address: '987 Cedar Ln, Everywhere',
    }
  ];

  await customerRepository.save(testCustomers);
  console.log('Seeded 6 test customers');

  await connection.close();
}
