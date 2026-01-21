import { Injectable, Inject } from '@nestjs/common';
import type { AuctionRepository } from '../../domain/ports/auction-repository.port';
import type { EventBus } from '../../domain/ports/event-bus.port';
import { AUCTION_REPOSITORY, EVENT_BUS } from '../../domain/ports/tokens';

@Injectable()
export class FinishAuctionUseCase {
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

    auction.finish({
      now: input.now,
    });

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
