import { Module } from '@nestjs/common';
import { AUCTION_REPOSITORY, EVENT_BUS } from './domain/ports/tokens';

import { AuctionRepository } from './infrastructure/repository/auction.repository';
import { InMemoryEventBus } from './infrastructure/event-bus/in-memory-event-bus';

import { AuctionController } from './presentation/controllers/auction.controller';

import { CreateAuctionUseCase } from './application/use-cases/create-auction.use-case';
import { ScheduleAuctionUseCase } from './application/use-cases/schedule-auction.use-case';
import { CancelAuctionUseCase } from './application/use-cases/cancel-auction.use-case';
import { FinishAuctionUseCase } from './application/use-cases/finish-auction.use-case';

@Module({
  controllers: [AuctionController],
  providers: [
    CreateAuctionUseCase,
    ScheduleAuctionUseCase,
    CancelAuctionUseCase,
    FinishAuctionUseCase,
    {
      provide: AUCTION_REPOSITORY,
      useClass: AuctionRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
  ],
})
export class AuctionModule {}
