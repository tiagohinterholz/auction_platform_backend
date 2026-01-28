import { Injectable, Inject } from '@nestjs/common';
import { Auction } from '../../domain/auction.aggregate';
import type { AuctionRepositoryPort } from '../../domain/ports/auction-repository.port';
import type { EventBus } from '../../domain/ports/event-bus.port';
import { AUCTION_REPOSITORY, EVENT_BUS } from '../../domain/ports/tokens';

@Injectable()
export class CreateAuctionUseCase {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepositoryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: {
    id: string;
    title: string;
    startingPrice: number;
    minimumIncrement: number;
  }): Promise<void> {
    const auction = Auction.create(input);

    this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
