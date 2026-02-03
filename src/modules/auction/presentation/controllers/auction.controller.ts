import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateAuctionDto } from '../../application/dtos/create-auction.dto';
import { ScheduleAuctionDto } from '../../application/dtos/schedule-auction.dto';
import { CancelAuctionDto } from '../../application/dtos/cancel-auction.dto';

import { CreateAuctionUseCase } from '../../application/use-cases/create-auction.use-case';
import { ScheduleAuctionUseCase } from '../../application/use-cases/schedule-auction.use-case';
import { CancelAuctionUseCase } from '../../application/use-cases/cancel-auction.use-case';
import { FinishAuctionUseCase } from '../../application/use-cases/finish-auction.use-case';
import { AuctionReadRepository } from '../../application/read-models/auction-read.repository';

@Controller('auctions')
export class AuctionController {
  constructor(
    private readonly cancelAuctionUseCase: CancelAuctionUseCase,
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly scheduleAuctionUseCase: ScheduleAuctionUseCase,
    private readonly finishAuctionUseCase: FinishAuctionUseCase,
    private readonly auctionReadRepository: AuctionReadRepository,
  ) {}

  @Get()
  getAllReadModel() {
    const auctions = this.auctionReadRepository.findAll();

    if (!auctions) {
      throw new NotFoundException('Auction read model not found');
    }

    return auctions;
  }

  @Get(':id')
  getReadModel(@Param('id') id: string) {
    const auction = this.auctionReadRepository.findById(id);

    if (!auction) {
      throw new NotFoundException('Auction read model not found');
    }

    return auction;
  }

  @Post()
  createAuction(@Body() dto: CreateAuctionDto) {
    void this.createAuctionUseCase.execute(dto);

    return { status: 'created' };
  }

  @Patch(':id/schedule')
  scheduleAuction(
    @Param('id') auctionId: string,
    @Body() dto: ScheduleAuctionDto,
  ) {
    void this.scheduleAuctionUseCase.execute({
      auctionId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      now: new Date(),
    });

    return { status: 'scheduled' };
  }

  @Patch(':id/cancel')
  cancelAuction(@Param('id') auctionId: string, @Body() dto: CancelAuctionDto) {
    void this.cancelAuctionUseCase.execute({
      auctionId,
      reason: dto.reason,
      now: new Date(),
    });

    return { status: 'cancelled' };
  }

  @Patch(':id/finish')
  finishAuction(@Param('id') auctionId: string) {
    void this.finishAuctionUseCase.execute({
      auctionId,
      now: new Date(),
    });

    return { status: 'finished' };
  }
}
