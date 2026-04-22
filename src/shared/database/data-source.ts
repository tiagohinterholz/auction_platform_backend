import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AuctionPersistenceEntity } from '../../modules/auction/infrastructure/persistence/auction.persistence-entity';
import { AuctionReadModel } from '../../modules/auction/application/read-models/auction-read.model';
import { BiddingPersistenceEntity } from '../../modules/bidding/infrastructure/persistence/bidding.persistence-entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5434'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    AuctionPersistenceEntity,
    BiddingPersistenceEntity,
    AuctionReadModel,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
