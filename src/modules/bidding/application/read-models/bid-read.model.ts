import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('bids_history')
export class BidReadModel {
  @PrimaryColumn()
  id: string;

  @Column()
  auctionId: string;

  @Column()
  userId: string;

  @Column({
    type: 'bigint',
    transformer: { to: (v) => v, from: (v) => parseInt(v) },
  })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
