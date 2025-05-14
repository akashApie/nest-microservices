# Roadblocks and Resolutions

This document lists significant challenges encountered during the development of the microservices project, along with how they were resolved.

---

## 1. Dependency Conflicts with @nestjs/swagger
**Problem:**
- The latest `@nestjs/swagger` requires `@nestjs/common@11.x`, but the project uses `@nestjs/common@10.x`.

**Diagnosis:**
- Attempting to install `@nestjs/swagger` with npm/yarn led to peer dependency errors.

**Resolution:**
- Used the `--legacy-peer-deps` flag with npm to force installation and ensure compatibility with NestJS v10.

---

## 2. Seeding Directory Not Found
**Problem:**
- Attempting to create seed scripts failed because the `seeds` directory did not exist.

**Diagnosis:**
- File creation failed until the directory was manually created.

**Resolution:**
- Used `mkdir` to create the `src/seeds` directory before writing seed scripts.

---

## 3. Jest Configuration Missing
**Problem:**
- No Jest config was present, so tests could not be run out of the box.

**Diagnosis:**
- Attempting to run `jest` failed due to missing configuration files.

**Resolution:**
- Added minimal `jest.config.js` files to both services to enable unit and E2E testing.

---

## 4. RabbitMQ/NestJS Microservices Setup
**Problem:**
- Ensuring reliable message delivery and correct event/command patterns between services.

**Diagnosis:**
- Required careful configuration of client/server and event/command handlers.

**Resolution:**
- Followed NestJS microservices best practices, used event/command patterns, and tested end-to-end communication.

---

Add more roadblocks here as the project evolves.
