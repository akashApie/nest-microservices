# E-Commerce Microservices Project

## Overview
This project implements a complete e-commerce system using microservices architecture with NestJS, PostgreSQL, and RabbitMQ for backend services, and Next.js for the frontend. The system consists of three main components:

- **Customer Service**: Manages customer data and emits customer-related events via RabbitMQ.
- **Product-Order Service**: Manages products and orders, processes order creation, and synchronizes with the customer service via RabbitMQ.
- **Next.js Frontend**: A responsive user interface for browsing products, managing a shopping cart, placing orders, and viewing order history.

Both backend services use TypeORM for database interaction, implement comprehensive error handling, include detailed logging, and provide API documentation with Swagger UI.

---

## Architecture
- **NestJS** for scalable service structure
- **PostgreSQL** for persistent storage
- **RabbitMQ** for asynchronous inter-service communication
- **Next.js** for the frontend application

```
+----------------------+     +-----------------------+     +--------------------+
|   Next.js Frontend   |<--->| Product-Order Service |<--->|  Customer Service  |
+----------------------+     +-----------------------+     +--------------------+
                                      |                            |
                                      v                            v
                              +-----------------+          +-----------------+
                              | PostgreSQL (PO) |          | PostgreSQL (CS) |
                              +-----------------+          +-----------------+
                                                \          /
                                                 \        /
                                                  v      v
                                               +------------+
                                               |  RabbitMQ  |
                                               +------------+
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL (v12+)
- RabbitMQ (v3.8+)

### Environment Variables
Each service requires specific environment variables. The necessary configurations are already provided in the `.env.development` files within each service directory:

- **Customer Service**: `.env.development` has configs for database, RabbitMQ, and service port (3000)
- **Product-Order Service**: `.env.development` has configs for database, RabbitMQ, and service port (3001)
- **Frontend**: `.env.local` has API endpoint URLs for the microservices

---

## Installation and Setup

### 1. Install PostgreSQL and RabbitMQ
- **PostgreSQL**: Download and install from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **RabbitMQ**: Download and install from [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

### 2. Setup Databases
Create two PostgreSQL databases with the following commands (using psql or pgAdmin):

```sql
-- Create databases
CREATE DATABASE customer_db;
CREATE DATABASE product_order_db;

-- For customer_db
CREATE USER customer_user WITH PASSWORD 'customer_pass';
GRANT ALL PRIVILEGES ON DATABASE customer_db TO customer_user;

-- For product_order_db
CREATE USER product_user WITH PASSWORD 'product_pass';
GRANT ALL PRIVILEGES ON DATABASE product_order_db TO product_user;

-- Grant necessary privileges (run for each database)
-- Connect to each database first before running this
GRANT ALL ON SCHEMA public TO customer_user;  -- Run while connected to customer_db
GRANT ALL ON SCHEMA public TO product_user;   -- Run while connected to product_order_db

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Run for both databases
```

### 3. Install Dependencies

```bash
# Install customer service dependencies
cd customer-service
npm install

# Install product-order service dependencies
cd ../product-order-service
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run Database Migrations

```bash
# Run customer service migrations
cd customer-service
npm run migration:run

# Run product-order service migrations
cd ../product-order-service
npm run migration:run
```

### 5. Seed Initial Data

```bash
# Seed customer service data
cd customer-service
npm run seed

# Seed product-order service data
cd ../product-order-service
npm run seed
```

### 6. Start All Services

```bash
# Start RabbitMQ (if not started automatically on installation)
# On Windows, it typically runs as a service after installation
# On Linux/Mac: rabbitmq-server

# Terminal 1: Start customer service
cd customer-service
npm run start:dev

# Terminal 2: Start product-order service
cd product-order-service
npm run start:dev

# Terminal 3: Start frontend
cd frontend
npm run dev
```

---

## API Documentation (Swagger)

- Customer Service: [http://localhost:3000/api](http://localhost:3000/api)
- Product-Order Service: [http://localhost:3001/api](http://localhost:3001/api)

You can use these endpoints to explore and test the REST APIs for both services interactively.

---

## Frontend Application

The Next.js frontend is available at [http://localhost:3000](http://localhost:3000) and provides:

- Product listing page
- Shopping cart functionality
- Checkout process
- Order history page

The frontend communicates with both microservices to provide a seamless user experience.

---

## Testing

Each backend microservice includes unit and integration tests using Jest. To run the tests:

```bash
# Run tests for customer service
cd customer-service
npm test

# Run tests for product-order service
cd ../product-order-service
npm test
```

---

## Project Structure

```
microservices-project/
├── customer-service/         # Customer microservice (NestJS)
│   ├── src/
│   ├── test/
│   └── ...
├── product-order-service/    # Product & order microservice (NestJS)
│   ├── src/
│   ├── test/
│   └── ...
├── frontend/                 # Next.js frontend
│   ├── src/
│   └── ...
└── README.md
```

---

## Cross-Cutting Concerns

- **Logging**: Centralized logger in each service.
- **Error Handling**: Global exception filters for consistent API errors.
- **Validation**: DTO validation using class-validator.

---

## Troubleshooting

- Ensure all environment variables are set correctly.
- Use `--legacy-peer-deps` if you encounter npm dependency issues.
- Database connection errors? Check that PostgreSQL is running and the credentials are correct.
- Message queue issues? Verify that RabbitMQ is running and accessible.

---

## License
MIT
