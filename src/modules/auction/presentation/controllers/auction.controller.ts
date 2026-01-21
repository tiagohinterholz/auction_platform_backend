import { Body, Controller, Param, Post } from '@nestjs/common';

import { CreateAuctionDto } from '../../application/dtos/create-auction.dto';
import { ScheduleAuctionDto } from '../../application/dtos/schedule-auction.dto';
import { CancelAuctionDto } from '../../application/dtos/cancel-auction.dto';

import { CreateAuctionUseCase } from '../../application/use-cases/create-auction.use-case';
import { ScheduleAuctionUseCase } from '../../application/use-cases/schedule-auction.use-case';
import { CancelAuctionUseCase } from '../../application/use-cases/cancel-auction.use-case';
import { FinishAuctionUseCase } from '../../application/use-cases/finish-auction.use-case';

@Controller('auctions')
export class AuctionController {
  constructor(
    private readonly cancelAuctionUseCase: CancelAuctionUseCase,
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly scheduleAuctionUseCase: ScheduleAuctionUseCase,
    private readonly finishAuctionUseCase: FinishAuctionUseCase,
  ) {}

  @Post()
  async createAuction(@Body() dto: CreateAuctionDto) {
    await this.createAuctionUseCase.execute(dto);

    return { status: 'created' };
  }

  @Post(':id/schedule')
  async scheduleAuction(
    @Param('id') auctionId: string,
    @Body() dto: ScheduleAuctionDto,
  ) {
    await this.scheduleAuctionUseCase.execute({
      auctionId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      now: new Date(),
    });

    return { status: 'scheduled' };
  }

  @Post(':id/cancel')
  async cancelAuction(
    @Param('id') auctionId: string,
    @Body() dto: CancelAuctionDto,
  ) {
    await this.cancelAuctionUseCase.execute({
      auctionId,
      reason: dto.reason,
      now: new Date(),
    });

    return { status: 'cancelled' };
  }

  @Post(':id/finish')
  async finishAuction(@Param('id') auctionId: string) {
    await this.finishAuctionUseCase.execute({
      auctionId,
      now: new Date(),
    });

    return { status: 'finished' };
  }
}
