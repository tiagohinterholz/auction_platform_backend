import { Injectable, Inject } from '@nestjs/common';
import { Auction } from '../../domain/auction.aggregate';
import type { AuctionRepositoryPort } from '../../domain/ports/auction-repository.port';
import type { EventBus } from '../../../../shared/events/event-bus.port';
import { AUCTION_REPOSITORY } from '../../domain/ports/tokens';
import { EVENT_BUS } from '../../../../shared/events/tokens';

@Injectable()
export class CreateAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepositoryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: {
    userId: string;
    title: string;
    description?: string;
    startingPrice: number;
    minimumIncrement: number;
    images: string[];
  }): Promise<void> {
    const auction = Auction.create(input);

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
