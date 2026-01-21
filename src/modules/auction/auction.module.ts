import { Module } from '@nestjs/common';
import { AuctionService } from './infrastructure/services/auction.service';
import { AUCTION_REPOSITORY, EVENT_BUS } from './domain/ports/tokens';
import { InMemoryAuctionRepository } from './infrastructure/repository/in-memory-auction.repository';
import { InMemoryEventBus } from './infrastructure/event-bus/in-memory-event-bus';
import { AuctionController } from './presentation/controllers/auction.controller';

@Module({
  controllers: [AuctionController],
  providers: [
    AuctionService,
    {
      provide: AUCTION_REPOSITORY,
      useClass: InMemoryAuctionRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
  ],
  exports: [AuctionService],
})
export class AuctionModule {}
