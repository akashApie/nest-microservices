# Microservices Project

## Overview
This project demonstrates a microservices architecture using NestJS, Docker, PostgreSQL, and RabbitMQ. It consists of two main services:

- **Customer Service**: Manages customer data and emits customer events via RabbitMQ.
- **Product-Order Service**: Manages products and orders, and listens for customer events via RabbitMQ.

Both services use TypeORM for database interaction and include centralized logging, global error handling, and API documentation with Swagger.

---

## Architecture
- **NestJS** for scalable service structure
- **PostgreSQL** for persistent storage
- **RabbitMQ** for asynchronous inter-service communication
- **Docker Compose** for local orchestration

```
+---------------------+        +------------------------+
|   Customer Service  |<-----> | Product-Order Service  |
+---------------------+        +------------------------+
         |                             |
         |                             |
   +-----------+                +-----------+
   |PostgreSQL |                |PostgreSQL |
   +-----------+                +-----------+
         |                             |
         +-------------+---------------+
                       |
                 +-------------+
                 |  RabbitMQ   |
                 +-------------+
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Docker & Docker Compose

### Environment Variables
Each service requires:
- `RABBITMQ_URI`: RabbitMQ connection string
- `RABBITMQ_QUEUE`: Queue name
- `DATABASE_URL` or TypeORM config variables
- `PORT`: Service port

See each service's `.env.example` for details.

---

## Running the Project

### 1. Start Dependencies
```
docker-compose up -d
```
This starts PostgreSQL and RabbitMQ.

### 2. Install Dependencies
```
cd customer-service && npm install
cd ../product-order-service && npm install
```

### 3. Start Services
```
# In separate terminals:
cd customer-service && npm run start:dev
cd product-order-service && npm run start:dev
```

---

## API Documentation (Swagger)
- Customer Service: [http://localhost:3000/api](http://localhost:3000/api)
- Product-Order Service: [http://localhost:3001/api](http://localhost:3001/api)

---

## Seeding Initial Data

### 1. Seed Customers
```
cd customer-service
npx ts-node src/seeds/seed-customers.ts
```

### 2. Seed Products
```
cd ../product-order-service
npx ts-node src/seeds/seed-products-orders.ts
```

> **Note:** Order seeding requires valid customer and product IDs. You can enable order seeding in the script after initial data is present.

---

## Cross-Cutting Concerns
- **Logging**: Centralized logger in each service.
- **Error Handling**: Global exception filters for consistent API errors.
- **Validation**: DTO validation using class-validator.

---

## Troubleshooting
- Ensure all environment variables are set.
- Use `--legacy-peer-deps` if you encounter npm dependency issues.
- Database connection errors? Check Docker containers and env vars.

---

## License
MIT
