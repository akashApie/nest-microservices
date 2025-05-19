import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderHistoryColumn1716091123000 implements MigrationInterface {
  name = 'AddOrderHistoryColumn1716091123000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \"customers\" ADD \"orderHistory\" jsonb NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \"customers\" DROP COLUMN \"orderHistory\"`);
  }
}
