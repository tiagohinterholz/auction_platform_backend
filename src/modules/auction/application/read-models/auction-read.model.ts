import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';

@Entity('auction_read_models')
export class AuctionReadModel {
  @PrimaryColumn()
  auctionId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
  })
  status: AuctionStatus;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  startingPrice: number;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  highestBid: number;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  minimumIncrement: number;

  @Column({ nullable: true })
  startTime?: string;

  @Column({ nullable: true })
  endTime?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];
}
