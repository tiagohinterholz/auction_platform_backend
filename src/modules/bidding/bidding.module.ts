import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingController } from './presentation/controllers/bidding.controller';
import { PlaceBidUseCase } from './application/use-cases/place-bid.use-case';
import { BiddingRepository } from './infrastructure/repository/bidding.repository';
import { BIDDING_REPOSITORY } from './domain/ports/tokens';
import { BiddingPersistenceEntity } from './infrastructure/persistence/bidding.persistence-entity';

import { AuctionModule } from '../auction/auction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BiddingPersistenceEntity]),
    AuctionModule,
  ],
  controllers: [BiddingController],
  providers: [
    PlaceBidUseCase,
    BiddingRepository,
    {
      provide: BIDDING_REPOSITORY,
      useClass: BiddingRepository,
    },
  ],
})
export class BiddingModule {}
