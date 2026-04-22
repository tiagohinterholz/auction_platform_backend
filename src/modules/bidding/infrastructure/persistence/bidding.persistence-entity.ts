import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('biddings')
export class BiddingPersistenceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  auctionId: string;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  currentPrice: number;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  minimumIncrement: number;

  @Column({ nullable: true })
  lastBidderId?: string;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: { to: (v) => v, from: (v) => (v ? parseInt(v) : null) },
  })
  lastBidAmount?: number;

  @Column({ nullable: true })
  lastBidAt?: string;
}
