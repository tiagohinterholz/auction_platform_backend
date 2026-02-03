import { Inject, Injectable } from '@nestjs/common';
import { Bidding } from '../../domain/bidding.aggregate';
import type { BiddingRepositoryPort } from '../../domain/ports/bidding-repository-port';
import { BIDDING_REPOSITORY } from '../../domain/ports/tokens';
import { AuctionStartedEvent } from '../../../auction/domain/events/auction-started.event';

@Injectable()
export class AuctionStartedHandler {
  constructor(
    @Inject(BIDDING_REPOSITORY)
    private readonly biddingRepository: BiddingRepositoryPort,
  ) {}

  handle(event: AuctionStartedEvent): void {
    const bidding = Bidding.open({
      id: event.payload.auctionId,
      auctionId: event.payload.auctionId,
      startingPrice: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
    });

    void this.biddingRepository.save(bidding);
  }
}
