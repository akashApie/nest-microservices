import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { initialProducts } from './seeds/product.seed';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'product_service',
    entities: [Product],
    synchronize: true,
  });

  await dataSource.initialize();
  
  try {
    console.log('Seeding products...');
    await dataSource.getRepository(Product).save(initialProducts);
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch(error => console.error('Fatal seeding error:', error));
