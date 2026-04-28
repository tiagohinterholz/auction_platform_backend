// injeta RefreshTokenEntity via @InjectRepository(RefreshTokenEntity)

import { InjectRepository } from '@nestjs/typeorm';
import {
  IRefreshTokenRepository,
  RefreshTokenData,
} from '../../domain/ports/refresh-token.interface';
import { RefreshTokenEntity } from '../persistence/refresh-token.entity';
import { IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}
  async save(data: {
    jti: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.repository.save(data);
  }
  async findByJti(jti: string): Promise<RefreshTokenData | null> {
    return await this.repository.findOne({ where: { jti } });
  }
  async revokeByJti(jti: string): Promise<void> {
    await this.repository.update({ jti }, { revokedAt: new Date() });
  }
  async revokeAllByUserId(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }
}
