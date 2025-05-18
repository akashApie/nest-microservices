import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Product } from '../products/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
  const orderRepo = app.get<Repository<Order>>(getRepositoryToken(Order));

  const products = [
    { name: 'Laptop', description: 'High performance laptop', price: 1200 },
    { name: 'Smartphone', description: 'Latest model smartphone', price: 800 },
    { name: 'Headphones', description: 'Noise-cancelling headphones', price: 200 },
  ];

  for (const data of products) {
    const exists = await productRepo.findOne({ where: { name: data.name } });
    if (!exists) {
      await productRepo.save(productRepo.create(data));
      console.log(`Inserted product: ${data.name}`);
    } else {
      console.log(`Product already exists: ${data.name}`);
    }
  }

  // Optionally seed orders (requires valid customerId and productId)
  // const orders = [
  //   { customerId: 1, productId: 1, quantity: 2 },
  //   { customerId: 2, productId: 2, quantity: 1 },
  // ];
  // for (const data of orders) {
  //   await orderRepo.save(orderRepo.create(data));
  //   console.log(`Inserted order for customer ${data.customerId}`);
  // }

  await app.close();
  console.log('Product seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
