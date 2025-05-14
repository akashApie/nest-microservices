import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - should return 201', async () => {
    const dto = { name: 'E2E Product', description: 'desc', price: 100 };
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(dto)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(dto.name);
  });
});
