import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePhoneFromCustomer1716041707000 implements MigrationInterface {
  name = 'RemovePhoneFromCustomer1716041707000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \"customers\" DROP CONSTRAINT IF EXISTS \"UQ_cb9a624efb2a7c7c0a1c9d1b3e4\"`);
    await queryRunner.query(`ALTER TABLE \"customers\" DROP COLUMN IF EXISTS \"phone\"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \"customers\" ADD \"phone\" character varying`);
    await queryRunner.query(`ALTER TABLE \"customers\" ADD CONSTRAINT \"UQ_cb9a624efb2a7c7c0a1c9d1b3e4\" UNIQUE (\"phone\")`);
  }
}
