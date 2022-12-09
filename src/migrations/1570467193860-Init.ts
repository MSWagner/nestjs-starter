/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1570467193860 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "refresh_token" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "validUntil" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUid" uuid NOT NULL, CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af" PRIMARY KEY ("token"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "permission" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "scope" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_09d8a179c1b8737b098285dfc06" UNIQUE ("scope"), CONSTRAINT "PK_df7a31ef51a9c86c235475c01dd" PRIMARY KEY ("uid"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user_permission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUid" uuid NOT NULL, "permissionUid" uuid NOT NULL, CONSTRAINT "PK_c4f9d79d207346e05cd369bea9c" PRIMARY KEY ("userUid", "permissionUid"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "passwordHash" text DEFAULT NULL, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY ("uid"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "access_token" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "validUntil" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUid" uuid NOT NULL, CONSTRAINT "PK_70ba8f6af34bc924fc9e12adb8f" PRIMARY KEY ("token"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_e0fe4fa46c0ec1b9f7232c47e05" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_c61c05b9860545f4d2ff6d9be91" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_c4986af533e9b69406359488051" FOREIGN KEY ("permissionUid") REFERENCES "permission"("uid") ON DELETE CASCADE ON UPDATE CASCADE`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "access_token" ADD CONSTRAINT "FK_70fbc98188d25e34238ffd699b0" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "access_token" DROP CONSTRAINT "FK_70fbc98188d25e34238ffd699b0"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_c4986af533e9b69406359488051"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_c61c05b9860545f4d2ff6d9be91"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_e0fe4fa46c0ec1b9f7232c47e05"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "access_token"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "user_permission"`, undefined);
        await queryRunner.query(`DROP TABLE "permission"`, undefined);
        await queryRunner.query(`DROP TABLE "refresh_token"`, undefined);
    }
}
