import { seed } from './seed-products-orders';

async function bootstrap() {
  console.log('Starting product and order seed...');
  await seed();
  console.log('Product and order seed completed!');
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('Error during seed:', err);
  process.exit(1);
});
