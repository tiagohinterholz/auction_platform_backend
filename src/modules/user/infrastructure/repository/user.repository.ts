import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/user.aggregate';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPersistenceEntity } from '../persistence/user.persistence-entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../persistence/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserPersistenceEntity)
    private readonly userRepository: Repository<UserPersistenceEntity>,
  ) {}

  async create(user: User): Promise<void> {
    const entity = UserMapper.toPersistence(user);
    await this.userRepository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }
  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ email });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }
  async delete(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find();
    return entities.map((entity) => UserMapper.toDomain(entity));
  }
  async update(user: User): Promise<void> {
    const entity = UserMapper.toPersistence(user);
    await this.userRepository.update(entity.id, entity);
  }
}
