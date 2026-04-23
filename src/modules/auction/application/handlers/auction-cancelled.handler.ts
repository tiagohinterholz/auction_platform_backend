import { AuctionCancelledEvent } from '../../domain/events/auction-cancelled.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionCancelledHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  async handle(event: AuctionCancelledEvent): Promise<void> {
    const current = await this.readRepository.findById(event.payload.auctionId);

    if (!current) {
      return;
    }

    await this.readRepository.save({
      ...current,
      status: AuctionStatus.CANCELLED,
      endTime: event.payload.cancelledAt,
      reason: event.payload.reason,
    });
  }
}
