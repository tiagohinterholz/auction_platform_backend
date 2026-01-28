import { AuctionFinishedEvent } from '../../domain/events/auction-finished.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';

export class AuctionFinishedHandler {
  constructor(private readonly readRepository: AuctionReadRepository) {}

  handle(event: AuctionFinishedEvent): void {
    const current = this.readRepository.findById(event.payload.auctionId);

    if (!current) {
      return;
    }

    this.readRepository.save({
      ...current,
      status: AuctionStatus.FINISHED,
      endTime: event.payload.finishedAt,
    });
  }
}
