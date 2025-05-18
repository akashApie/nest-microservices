# Microservices Port Configuration

## HTTP Ports
- Frontend: 3000
- Customer Service: 3001
- Product-Order Service: 3002

## TCP Ports
- Customer Service: 4001
- Product-Order Service: 4002
- Product Service: 4003

## Database
- PostgreSQL: 5432

All ports can be overridden via environment variables:
- `PORT` for HTTP ports
- `TCP_PORT` for main service TCP port
- `PRODUCT_TCP_PORT` for product service port
