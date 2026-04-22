import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bidding } from '../../domain/bidding.aggregate';
import { BiddingRepositoryPort } from '../../domain/ports/bidding-repository-port';
import { BiddingMapper } from '../persistence/bidding.mapper';
import { BiddingPersistenceEntity } from '../persistence/bidding.persistence-entity';

export class BiddingRepository implements BiddingRepositoryPort {
  constructor(
    @InjectRepository(BiddingPersistenceEntity)
    private readonly repo: Repository<BiddingPersistenceEntity>,
  ) {}

  async findByAuctionId(auctionId: string): Promise<Bidding | null> {
    const entity = await this.repo.findOneBy({ auctionId });

    return entity ? BiddingMapper.toDomain(entity) : null;
  }

  async save(bidding: Bidding): Promise<void> {
    const entity = BiddingMapper.toPersistence(bidding);
    await this.repo.save(entity);
  }

  async findAllByAuctionId(auctionId: string): Promise<Bidding[]> {
    const entities = await this.repo.findBy({ auctionId });
    return entities.map((entity) => BiddingMapper.toDomain(entity));
  }
}
