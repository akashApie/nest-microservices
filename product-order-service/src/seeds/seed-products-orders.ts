import { createConnection } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';

export async function seed() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'thankyougod',
    database: process.env.DB_NAME || 'product_db',
    entities: [Product, Order, OrderItem],
    synchronize: false,
  });

  const productRepo = connection.getRepository(Product);
  const orderRepo = connection.getRepository(Order);
  const orderItemRepo = connection.getRepository(OrderItem);

  // Create test products
  const products = await productRepo.save([
    {
      name: 'Laptop',
      description: '15-inch laptop with 16GB RAM',
      price: 999.99,
      stock: 10,
    },
    {
      name: 'Smartphone',
      description: 'Latest model with 128GB storage',
      price: 699.99,
      stock: 20,
    },
    {
      name: 'Headphones',
      description: 'Wireless noise-cancelling headphones',
      price: 199.99,
      stock: 30,
    },
    {
      name: 'Tablet',
      description: '10-inch tablet with stylus',
      price: 349.99,
      stock: 15,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracking with heart rate monitor',
      price: 249.99,
      stock: 25,
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless with 24hr battery',
      price: 129.99,
      stock: 40,
    }
  ]);

  console.log('Seeded 6 test products');

  // Create test orders (assuming customer IDs from customer-service)
  const order1 = await orderRepo.save({
    customerId: '1', // John Doe
    orderDate: new Date(),
    status: 'completed',
    totalAmount: 1299.98,
  });

  const order2 = await orderRepo.save({
    customerId: '2', // Jane Smith
    orderDate: new Date(),
    status: 'processing',
    totalAmount: 899.98,
  });

  const order3 = await orderRepo.save({
    customerId: '4', // Alice Williams
    orderDate: new Date(),
    status: 'shipped',
    totalAmount: 599.98,
  });

  const order4 = await orderRepo.save({
    customerId: '5', // Charlie Brown
    orderDate: new Date(),
    status: 'delivered',
    totalAmount: 1299.97,
  });

  // Create order items
  await orderItemRepo.save([
    // Order 1 items
    {
      order: order1,
      product: products[0], // Laptop
      quantity: 1,
      price: 999.99,
    },
    {
      order: order1,
      product: products[2], // Headphones
      quantity: 1,
      price: 199.99,
    },
    // Order 2 items
    {
      order: order2,
      product: products[1], // Smartphone
      quantity: 1,
      price: 699.99,
    },
    {
      order: order2,
      product: products[2], // Headphones
      quantity: 1,
      price: 199.99,
    },
    // Order 3 items
    {
      order: order3,
      product: products[3], // Tablet
      quantity: 1,
      price: 349.99,
    },
    {
      order: order3,
      product: products[5], // Wireless Earbuds
      quantity: 1,
      price: 129.99,
    },
    // Order 4 items
    {
      order: order4,
      product: products[0], // Laptop
      quantity: 1,
      price: 999.99,
    },
    {
      order: order4,
      product: products[4], // Smart Watch
      quantity: 1,
      price: 249.99,
    },
    {
      order: order4,
      product: products[5], // Wireless Earbuds
      quantity: 2,
      price: 129.99,
    }
  ]);

  console.log('Seeded 4 test orders with items');
  await connection.close();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
