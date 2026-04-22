import { BidPlacedEvent } from '../../../bidding/domain/events/bid-placed.event';
import { Injectable } from '@nestjs/common';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { AuctionRepository } from '../../infrastructure/repository/auction.repository';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class BidPlacedHandler {
  constructor(
    private readonly readRepository: AuctionReadRepository,
    private readonly writeRepository: AuctionRepository,
    @InjectQueue('auction-jobs')
    private readonly auctionQueue: Queue,
  ) {}

  async handle(event: BidPlacedEvent): Promise<void> {
    const auction = await this.writeRepository.findById(
      event.payload.auctionId,
    );

    if (!auction) return;

    auction.applyAntiSniping(new Date());

    await this.writeRepository.save(auction);
    const currentReadModel = await this.readRepository.findById(
      event.payload.auctionId,
    );
    if (currentReadModel) {
      await this.readRepository.save({
        ...currentReadModel,
        highestBid: event.payload.amount,
        endTime: auction.getEndTime(),
      });
    }
    const endTime = auction.getEndTime();
    if (endTime) {
      const endDelay = new Date(endTime).getTime() - Date.now();
      await this.auctionQueue.add(
        'finish-auction',
        { auctionId: auction.getId() },
        {
          delay: Math.max(0, endDelay),
          jobId: `finish-${auction.getId()}`,
        },
      );
    }
  }
}
