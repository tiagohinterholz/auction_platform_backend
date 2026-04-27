import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BidPlacedEvent } from '../../domain/events/bid-placed.event';
import { BidReadModel } from '../read-models/bid-read.model';

@Injectable()
export class BidPlacedHandler {
  constructor(
    @InjectRepository(BidReadModel)
    private readonly readRepository: Repository<BidReadModel>,
  ) {}

  async handle(event: BidPlacedEvent): Promise<void> {
    await this.readRepository.save({
      id: event.payload.bidId,
      auctionId: event.payload.auctionId,
      userId: event.payload.userId,
      amount: event.payload.amount,
    });
  }
}
