/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsISO8601 } from 'class-validator';

export class ScheduleAuctionDto {
  @IsISO8601()
  startTime: string;

  @IsISO8601()
  endTime: string;
}
