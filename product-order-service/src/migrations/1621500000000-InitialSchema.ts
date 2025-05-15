import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1621500000000 implements MigrationInterface {
  name = 'InitialSchema1621500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create products table
    await queryRunner.query(`
      CREATE TABLE "product" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "stock" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_id" PRIMARY KEY ("id")
      )
    `);

    // Create orders table
    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "orderDate" TIMESTAMP NOT NULL DEFAULT now(),
        "status" character varying NOT NULL DEFAULT 'pending',
        "totalAmount" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
      )
    `);

    // Create order items table
    await queryRunner.query(`
      CREATE TABLE "order_item" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "orderId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_item_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "order_item" 
      ADD CONSTRAINT "FK_order_item_order" 
      FOREIGN KEY ("orderId") REFERENCES "order"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_item" 
      ADD CONSTRAINT "FK_order_item_product" 
      FOREIGN KEY ("productId") REFERENCES "product"("id") 
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    // Create index for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_order_customerId" ON "order" ("customerId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_product"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_order"
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_order_customerId"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
