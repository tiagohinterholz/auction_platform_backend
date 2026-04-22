import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { StartAuctionUseCase } from '../use-cases/start-auction.use-case';
import { FinishAuctionUseCase } from '../use-cases/finish-auction.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
@Processor('auction-jobs')
export class AuctionProcessor extends WorkerHost {
  constructor(
    private readonly finishAuctionUseCase: FinishAuctionUseCase,
    private readonly startAuctionUseCase: StartAuctionUseCase,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const auctionId = job.data.auctionId;
    switch (job.name) {
      case 'start-auction':
        console.log('Starting auction', auctionId);
        await this.startAuctionUseCase.execute({ auctionId, now: new Date() });
        break;
      case 'finish-auction':
        console.log('Finishing auction', auctionId);
        await this.finishAuctionUseCase.execute({ auctionId, now: new Date() });
        break;
    }
  }
}
