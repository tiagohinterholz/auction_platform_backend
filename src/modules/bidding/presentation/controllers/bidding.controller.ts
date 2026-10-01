import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaceBidUseCase } from '../../application/use-cases/place-bid.use-case';
import { CreateBidDto } from '../../application/dtos/create-bid.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BidReadModel } from '../../application/read-models/bid-read.model';

@Controller('auctions/:auctionId/bids')
export class BiddingController {
  constructor(
    private readonly placeBidUseCase: PlaceBidUseCase,
    @InjectRepository(BidReadModel)
    private readonly bidReadRepository: Repository<BidReadModel>,
  ) {}

  @Get()
  async getAllByAuctionId(@Param('auctionId') auctionId: string) {
    const bids = await this.bidReadRepository.find({
      where: { auctionId },
      order: { createdAt: 'DESC' },
    });

    return bids;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBid(
    @Param('auctionId') auctionId: string,
    @Body() dto: CreateBidDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    await this.placeBidUseCase.execute({
      bidId: randomUUID(),
      auctionId,
      userId,
      amount: dto.amount,
      now: new Date(),
    });

    return { status: 'created' };
  }
}
