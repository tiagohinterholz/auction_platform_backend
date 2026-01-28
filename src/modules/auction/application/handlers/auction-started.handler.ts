import { AuctionStartedEvent } from '../../domain/events/auction-started.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionStartedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionStartedEvent): Promise<void> {
    const current = this.readRepository.findById(event.payload.auctionId);

    this.readRepository.save({
      auctionId: event.payload.auctionId,
      status: AuctionStatus.ACTIVE,
      startingPrice: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
      ...(current ?? {}),
    });
  }
}
