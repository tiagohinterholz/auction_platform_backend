import { Injectable, Inject } from '@nestjs/common';
import type { EventBus } from '../../../../shared/events/event-bus.port';
import { AUCTION_REPOSITORY } from '../../domain/ports/tokens';
import { EVENT_BUS } from '../../../../shared/events/tokens';
import { AuctionRepository } from '../../infrastructure/repository/auction.repository';

@Injectable()
export class StartAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: { auctionId: string; now: Date }): Promise<void> {
    const auction = await this.auctionRepository.findById(input.auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.start({
      now: input.now,
    });

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
