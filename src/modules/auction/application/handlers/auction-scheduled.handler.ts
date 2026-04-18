import { AuctionScheduledEvent } from '../../domain/events/auction-scheduled.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionScheduledHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionScheduledEvent): Promise<void> {
    const current = await this.readRepository.findById(event.payload.auctionId);

    await this.readRepository.save({
      ...(current ?? {}),
      auctionId: event.payload.auctionId,
      status: AuctionStatus.SCHEDULED,
      startTime: event.payload.startTime,
      endTime: event.payload.endTime,
      startingPrice: event.payload.startingPrice,
      highestBid: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
      images: event.payload.images ?? [],
    });
  }
}
