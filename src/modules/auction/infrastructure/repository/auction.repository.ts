import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../../domain/auction.aggregate';
import { AuctionRepositoryPort } from '../../domain/ports/auction-repository.port';
import { AuctionMapper } from '../persistence/auction.mapper';
import { AuctionPersistenceEntity } from '../persistence/auction.persistence-entity';

export class AuctionRepository implements AuctionRepositoryPort {
  constructor(
    @InjectRepository(AuctionPersistenceEntity)
    private readonly repo: Repository<AuctionPersistenceEntity>,
  ) {}

  async save(auction: Auction): Promise<void> {
    const entity = AuctionMapper.toPersistence(auction);
    await this.repo.save(entity);
  }

  async findById(id: string): Promise<Auction | null> {
    const entity = await this.repo.findOneBy({ auctionId: id });
    if (!entity) return null;
    return AuctionMapper.toDomain(entity);
  }
}
