import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AuctionStatus } from '../../domain/enums/auction-status.enum';

@Entity('auctions')
export class AuctionPersistenceEntity {
  @PrimaryGeneratedColumn('uuid')
  auctionId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.CREATED,
  })
  status: AuctionStatus;

  @Column({ nullable: true })
  startTime?: string;

  @Column({ nullable: true })
  endTime?: string;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  startingPrice: number;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  minimumIncrement: number;

  @Column('simple-array')
  images: string[];
}
