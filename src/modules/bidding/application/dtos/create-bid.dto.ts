import { IsInt, Min } from 'class-validator';

export class CreateBidDto {
  @IsInt()
  @Min(0)
  amount: number;
}
