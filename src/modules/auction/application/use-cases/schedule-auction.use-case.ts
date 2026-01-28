import { Injectable, Inject } from '@nestjs/common';
import type { EventBus } from '../../domain/ports/event-bus.port';
import { AUCTION_REPOSITORY, EVENT_BUS } from '../../domain/ports/tokens';
import { AuctionRepository } from '../../infrastructure/repository/auction.repository';

@Injectable()
export class ScheduleAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepository,
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
    this.eventBus.publish(events);
  }
}
