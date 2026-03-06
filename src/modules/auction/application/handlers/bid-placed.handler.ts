import { BidPlacedEvent } from '../../../bidding/domain/events/bid-placed.event';
import { Injectable } from '@nestjs/common';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { AuctionStatus } from '../../domain/auction.aggregate';

@Injectable()
export class BidPlacedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  handle(event: BidPlacedEvent): void {
    const current = this.readRepository.findById(event.payload.auctionId);

    this.readRepository.save({
      ...(current ?? {}),
      auctionId: event.payload.auctionId,
      status: AuctionStatus.ACTIVE,
      startingPrice: current?.startingPrice ?? 0,
      minimumIncrement: current?.minimumIncrement ?? 0,
      highestBid: event.payload.amount,
    });
  }
}
