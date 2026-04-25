import { AuctionCreatedEvent } from '../../domain/events/auction-created.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionCreatedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionCreatedEvent): Promise<void> {
    await this.readRepository.save({
      auctionId: event.payload.auctionId,
      description: event.payload.description,
      startingPrice: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
      images: event.payload.images ?? [],
      status: AuctionStatus.CREATED,
      highestBid: event.payload.startingPrice,
    });
  }
}
