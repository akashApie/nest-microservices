import { DataSource } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';

export const initialDataSeed = async (dataSource: DataSource): Promise<void> => {
  const customerRepository = dataSource.getRepository(Customer);

  // Check if customers already exist
  const existingCustomersCount = await customerRepository.count();
  if (existingCustomersCount > 0) {
    console.log('Customers already seeded, skipping...');
    return;
  }

  // Initial customer data
  const customers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      address: '123 Main St, Anytown, USA',
      orderIds: []
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-987-6543',
      address: '456 Oak Ave, Somewhere, USA',
      orderIds: []
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1-555-555-5555',
      address: '789 Pine Rd, Nowhere, USA',
      orderIds: []
    }
  ];

  // Save customers to database
  console.log('Seeding customers...');
  await customerRepository.save(
    customers.map(customer => customerRepository.create(customer))
  );
  
  console.log('Customer seed completed successfully!');
};
