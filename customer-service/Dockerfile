# Dockerfile for Customer Service
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
