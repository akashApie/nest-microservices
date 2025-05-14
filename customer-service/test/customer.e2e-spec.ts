import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CustomerController (e2e)', () => {
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

  it('/customers (POST) - should return 201', async () => {
    const dto = { name: 'E2E Test', email: 'e2e@example.com', address: 'E2E Lane' };
    const res = await request(app.getHttpServer())
      .post('/customers')
      .send(dto)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(dto.email);
  });
});
