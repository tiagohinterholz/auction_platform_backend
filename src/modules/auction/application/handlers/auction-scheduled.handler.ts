import { AuctionScheduledEvent } from '../../domain/events/auction-scheduled.event';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';
import { AuctionReadRepository } from '../read-models/auction-read.repository';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuctionScheduledHandler {
  constructor(
    private readonly readRepository: AuctionReadRepository,
    @InjectQueue('auction-jobs')
    private readonly auctionQueue: Queue,
  ) {}

  async handle(event: AuctionScheduledEvent): Promise<void> {
    const current = await this.readRepository.findById(event.payload.auctionId);

    const now = Date.now();
    const startDelay = new Date(event.payload.startTime).getTime() - now;

    await this.auctionQueue.add(
      'start-auction',
      { auctionId: event.payload.auctionId },
      {
        delay: Math.max(0, startDelay),
        jobId: `start-${event.payload.auctionId}`,
      },
    );

    const endDelay = new Date(event.payload.endTime).getTime() - now;
    await this.auctionQueue.add(
      'finish-auction',
      { auctionId: event.payload.auctionId },
      {
        delay: Math.max(0, endDelay),
        jobId: `finish-${event.payload.auctionId}`,
      },
    );

    await this.readRepository.save({
      ...(current ?? {}),
      auctionId: event.payload.auctionId,
      status: AuctionStatus.SCHEDULED,
      startTime: event.payload.startTime,
      endTime: event.payload.endTime,
      startingPrice: event.payload.startingPrice,
      highestBid: event.payload.startingPrice,
      minimumIncrement: event.payload.minimumIncrement,
      images: event.payload.images ?? [],
    });
  }
}
