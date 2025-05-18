import { seed } from './seed-customers';

async function bootstrap() {
  console.log('Starting customer seed...');
  await seed();
  console.log('Customer seed completed!');
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('Error during seed:', err);
  process.exit(1);
});
