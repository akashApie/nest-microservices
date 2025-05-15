import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1621500000000 implements MigrationInterface {
  name = 'InitialSchema1621500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table
    await queryRunner.query(`
      CREATE TABLE "customer" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "address" character varying,
        "orderIds" text ARRAY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customer_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_customer_email" UNIQUE ("email")
      )
    `);

    // Create indexes for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_customer_email" ON "customer" ("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_customer_email"`);
    
    // Drop tables
    await queryRunner.query(`DROP TABLE "customer"`);
  }
}
