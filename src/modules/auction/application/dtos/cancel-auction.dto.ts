import { IsString } from 'class-validator';

export class CancelAuctionDto {
  @IsString()
  reason?: string;
}
