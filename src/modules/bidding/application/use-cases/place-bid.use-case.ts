import { Inject, Injectable } from '@nestjs/common';
import { BIDDING_REPOSITORY } from '../../domain/ports/tokens';
import { Bidding } from '../../domain/bidding.aggregate';
import { InvalidBidPlaced } from '../../domain/exceptions/invalid-bid-placed.exception';
import {
  AUCTION_READ_REPOSITORY,
  EVENT_BUS,
} from '../../../auction/domain/ports/tokens';

import type { EventBus } from 'src/modules/auction/domain/ports/event-bus.port';
import type { BiddingRepositoryPort } from '../../domain/ports/bidding-repository-port';
import { AuctionReadRepository } from 'src/modules/auction/application/read-models/auction-read.repository';
import { AuctionStatus } from 'src/modules/auction/domain/enums/auction-status.enum';
import type { LockService } from 'src/shared/locks/lock.service';
import { LOCK_SERVICE } from 'src/shared/locks/token';

@Injectable()
export class PlaceBidUseCase {
  constructor(
    @Inject(BIDDING_REPOSITORY)
    private readonly biddingRepository: BiddingRepositoryPort,
    @Inject(AUCTION_READ_REPOSITORY)
    private readonly auctionReadRepository: AuctionReadRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
    @Inject(LOCK_SERVICE)
    private readonly lockService: LockService,
  ) {}

  async execute(input: {
    bidId: string;
    auctionId: string;
    userId: string;
    amount: number;
    now: Date;
  }) {
    try {
      const lockAcquired = await this.lockService.acquire(
        `auction:${input.auctionId}:lock`,
        2000,
      );

      if (!lockAcquired) {
        throw new Error('Auction is being processed by another user');
      }

      const auction = await this.auctionReadRepository.findById(
        input.auctionId,
      );
      if (!auction) {
        throw new Error('Auction not found');
      }

      if (auction.status !== AuctionStatus.ACTIVE) {
        throw new InvalidBidPlaced('Auction is not active');
      }

      const bidding =
        (await this.biddingRepository.findByAuctionId(input.auctionId)) ??
        Bidding.open({
          id: input.bidId,
          auctionId: input.auctionId,
          startingPrice: auction.startingPrice,
          minimumIncrement: auction.minimumIncrement,
        });

      bidding.placeBid({
        bidderId: input.userId,
        amount: input.amount,
        now: input.now,
      });

      await this.biddingRepository.save(bidding);

      const events = bidding.pullDomainEvents();
      await this.eventBus.publish(events);
    } finally {
      await this.lockService.release(`auction:${input.auctionId}:lock`);
    }
  }
}
