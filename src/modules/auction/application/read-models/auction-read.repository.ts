import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionReadModel } from '../read-models/auction-read.model';

export class AuctionReadRepository {
  constructor(
    @InjectRepository(AuctionReadModel)
    private readonly repo: Repository<AuctionReadModel>,
  ) {}

  async save(model: AuctionReadModel): Promise<void> {
    await this.repo.save(model);
  }

  async findById(id: string): Promise<AuctionReadModel | null> {
    return this.repo.findOneBy({ auctionId: id });
  }

  async findAll(): Promise<AuctionReadModel[]> {
    return this.repo.find();
  }
}
