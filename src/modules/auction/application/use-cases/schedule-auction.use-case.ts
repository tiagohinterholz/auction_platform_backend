import { Injectable, Inject } from '@nestjs/common';
import type { EventBus } from '../../domain/ports/event-bus.port';
import { AUCTION_REPOSITORY, EVENT_BUS } from '../../domain/ports/tokens';
import * as auctionRepositoryPort from '../../domain/ports/auction-repository.port';

@Injectable()
export class ScheduleAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: auctionRepositoryPort.AuctionRepositoryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  execute(input: {
    auctionId: string;
    startTime: string;
    endTime: string;
    now: Date;
  }): void {
    const auction = this.auctionRepository.findById(input.auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.schedule({
      startTime: input.startTime,
      endTime: input.endTime,
      now: input.now,
    });

    this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    void this.eventBus.publish(events);
  }
}
