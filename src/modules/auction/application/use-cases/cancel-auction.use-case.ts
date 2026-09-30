import { Injectable, Inject } from '@nestjs/common';
import { AuctionRepository } from '../../infrastructure/repository/auction.repository';
import type { EventBus } from '../../../../shared/events/event-bus.port';
import { AUCTION_REPOSITORY } from '../../domain/ports/tokens';
import { EVENT_BUS } from '../../../../shared/events/tokens';

@Injectable()
export class CancelAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: {
    auctionId: string;
    reason?: string;
    now: Date;
  }): Promise<void> {
    const auction = await this.auctionRepository.findById(input.auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.cancel({
      now: input.now,
      reason: input.reason,
    });

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
