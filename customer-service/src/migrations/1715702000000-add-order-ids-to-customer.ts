import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderIdsToCustomer1715702000000 implements MigrationInterface {
  name = 'AddOrderIdsToCustomer1715702000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN "orderIds" uuid[] DEFAULT '{}'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "orderIds"`
    );
  }
}
