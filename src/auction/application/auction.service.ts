import { Injectable, Inject } from '@nestjs/common';
import { Auction } from '../domain/auction.aggregate';
import type { AuctionRepository } from './ports/auction-repository.port';
import type { EventBus } from './ports/event-bus.port';
import { AUCTION_REPOSITORY, EVENT_BUS } from './ports/tokens';

@Injectable()
export class AuctionService {
  constructor(
    @Inject(AUCTION_REPOSITORY)
    private readonly auctionRepository: AuctionRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async createAuction(input: {
    id: string;
    title: string;
    startingPrice: number;
    minimumIncrement: number;
  }): Promise<void> {
    const auction = Auction.create(input);

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }

  async scheduleAuction(input: {
    auctionId: string;
    startTime: string;
    endTime: string;
    now: Date;
  }): Promise<void> {
    const auction = await this.auctionRepository.findById(input.auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.schedule({
      startTime: input.startTime,
      endTime: input.endTime,
      now: input.now,
    });

    await this.auctionRepository.save(auction);

    const events = auction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
