import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790852398109 implements MigrationInterface {
  name = 'InitialSchema1790852398109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."auctions_status_enum" AS ENUM('created', 'scheduled', 'active', 'finished', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "auctions" ("auctionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "status" "public"."auctions_status_enum" NOT NULL DEFAULT 'created', "startTime" character varying, "endTime" character varying, "startingPrice" bigint NOT NULL, "minimumIncrement" bigint NOT NULL, "images" text NOT NULL, CONSTRAINT "PK_4c313a748e8de8e62b5a67674ba" PRIMARY KEY ("auctionId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."auction_read_models_status_enum" AS ENUM('created', 'scheduled', 'active', 'finished', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction_read_models" ("auctionId" character varying NOT NULL, "userId" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."auction_read_models_status_enum" NOT NULL, "startingPrice" bigint NOT NULL, "highestBid" bigint NOT NULL, "minimumIncrement" bigint NOT NULL, "startTime" character varying, "endTime" character varying, "reason" character varying, "images" text, CONSTRAINT "PK_f4486c7851bc14e936eb5cc8b4a" PRIMARY KEY ("auctionId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "biddings" ("id" character varying NOT NULL, "auctionId" character varying NOT NULL, "currentPrice" bigint NOT NULL, "minimumIncrement" bigint NOT NULL, "lastBidderId" character varying, "lastBidAmount" bigint, "lastBidAt" character varying, CONSTRAINT "PK_7e33475be248d1fa69b1ccaa74a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "cpf" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jti" uuid NOT NULL, "userId" uuid NOT NULL, "tokenHash" character varying(255) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "revokedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad70f9f8a806b42bdac38c57569" UNIQUE ("jti"), CONSTRAINT "PK_df6893d2063a4ea7bbf1eda31e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bids_history" ("id" character varying NOT NULL, "auctionId" character varying NOT NULL, "userId" character varying NOT NULL, "amount" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad9b400d158eabdab775cf67522" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bids_history"`);
    await queryRunner.query(`DROP TABLE "auth_refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "biddings"`);
    await queryRunner.query(`DROP TABLE "auction_read_models"`);
    await queryRunner.query(
      `DROP TYPE "public"."auction_read_models_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "auctions"`);
    await queryRunner.query(`DROP TYPE "public"."auctions_status_enum"`);
  }
}
