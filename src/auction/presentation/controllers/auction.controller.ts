import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuctionService } from '../../application/auction.service';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { ScheduleAuctionDto } from '../dtos/schedule-auction.dto';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async createAuction(@Body() dto: CreateAuctionDto) {
    await this.auctionService.createAuction(dto);

    return { status: 'created' };
  }

  @Post(':id/schedule')
  async scheduleAuction(
    @Param('id') auctionId: string,
    @Body() dto: ScheduleAuctionDto,
  ) {
    await this.auctionService.scheduleAuction({
      auctionId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      now: new Date(),
    });

    return { status: 'scheduled' };
  }
}
