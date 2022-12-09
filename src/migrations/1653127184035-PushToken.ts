import { MigrationInterface, QueryRunner } from "typeorm";

export class PushToken1653127184035 implements MigrationInterface {
    name = "PushToken1653127184035";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "push_token" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUid" uuid NOT NULL, CONSTRAINT "UQ_8f3278f2198b31d9020abe9b7e4" UNIQUE ("token"), CONSTRAINT "PK_e08b7cb96fd0de2270867399a7d" PRIMARY KEY ("uid"))`
        );
        await queryRunner.query(
            `ALTER TABLE "push_token" ADD CONSTRAINT "FK_d312a7944e8ed194e580ec72124" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "push_token" DROP CONSTRAINT "FK_d312a7944e8ed194e580ec72124"`);
        await queryRunner.query(`DROP TABLE "push_token"`);
    }
}
