import { AuctionStartedEvent } from '../../domain/events/auction-started.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionStartedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionStartedEvent): Promise<void> {
    const current = await this.readRepository.findById(event.payload.auctionId);

    if (!current) {
      console.error(
        `Auction ${event.payload.auctionId} not found in read model`,
      );
      return;
    }

    await this.readRepository.save({
      ...current,
      status: AuctionStatus.ACTIVE,
      highestBid: event.payload.startingPrice,
    });
  }
}
