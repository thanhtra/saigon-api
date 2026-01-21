import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1769022052601 implements MigrationInterface {
    name = 'Init1769022052601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "amenities" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "amenities" SET DEFAULT ARRAY[]`);
    }

}
