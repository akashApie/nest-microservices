import { DataSource } from 'typeorm';
import { Product } from '../product/entities/product.entity';

export const initialDataSeed = async (dataSource: DataSource): Promise<void> => {
  const productRepository = dataSource.getRepository(Product);

  // Check if products already exist
  const existingProductsCount = await productRepository.count();
  if (existingProductsCount > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }

  // Initial product data
  const products = [
    {
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features and high-resolution camera.',
      price: 799.99,
      stock: 50,
    },
    {
      name: 'Laptop Pro',
      description: 'Powerful laptop for professionals with high performance and sleek design.',
      price: 1299.99,
      stock: 30,
    },
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with long battery life.',
      price: 199.99,
      stock: 100,
    },
    {
      name: 'Smart Watch',
      description: 'Health and fitness tracking smartwatch with heart rate monitor and GPS.',
      price: 249.99,
      stock: 75,
    },
    {
      name: 'Tablet Ultra',
      description: 'Slim and lightweight tablet with vibrant display and fast processor.',
      price: 499.99,
      stock: 40,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with immersive sound and waterproof design.',
      price: 129.99,
      stock: 120,
    },
    {
      name: 'Wireless Earbuds',
      description: 'Compact wireless earbuds with touch controls and charging case.',
      price: 89.99,
      stock: 150,
    },
    {
      name: 'External SSD 1TB',
      description: 'Fast and reliable external solid state drive with 1TB storage capacity.',
      price: 149.99,
      stock: 60,
    }
  ];

  // Save products to database
  console.log('Seeding products...');
  await productRepository.save(
    products.map(product => productRepository.create(product))
  );
  
  console.log('Product seed completed successfully!');
};
