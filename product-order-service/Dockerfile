# Dockerfile for Product-Order Service
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
