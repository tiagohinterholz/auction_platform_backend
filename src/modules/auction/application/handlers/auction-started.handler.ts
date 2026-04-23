import { AuctionStartedEvent } from '../../domain/events/auction-started.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionStartedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionStartedEvent): Promise<void> {
    const current = await this.readRepository.findById(event.payload.auctionId);

    await this.readRepository.save({
      ...(current ?? {}),
      auctionId: event.payload.auctionId,
      status: AuctionStatus.ACTIVE,
      startingPrice: event.payload.startingPrice,
      highestBid: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
    });
  }
}
