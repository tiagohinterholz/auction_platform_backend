import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [
    //use Cases
    // {
    //   provide: AUCTION_REPOSITORY,
    //   useClass: InMemoryAuctionRepository,
    // },
    // {
    //   provide: EVENT_BUS,
    //   useClass: InMemoryEventBus,
    // },
  ],
})
export class BiddingModule {}
