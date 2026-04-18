import { BidPlacedEvent } from '../../../bidding/domain/events/bid-placed.event';
import { Injectable } from '@nestjs/common';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { AuctionRepository } from '../../infrastructure/repository/auction.repository';

@Injectable()
export class BidPlacedHandler {
  constructor(
    private readonly readRepository: AuctionReadRepository,
    private readonly writeRepository: AuctionRepository,
  ) {}

  async handle(event: BidPlacedEvent): Promise<void> {
    const auction = await this.writeRepository.findById(
      event.payload.auctionId,
    );

    if (!auction) return;

    auction.applyAntiSniping(new Date());

    await this.writeRepository.save(auction);
    const currentReadModel = await this.readRepository.findById(
      event.payload.auctionId,
    );
    if (currentReadModel) {
      await this.readRepository.save({
        ...currentReadModel,
        highestBid: event.payload.amount,
        endTime: auction.getEndTime(),
      });
    }
  }
}
