import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { LockService } from './lock.service';

@Injectable()
export class RedisLockService implements LockService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async acquire(key: string, ttl: number): Promise<boolean> {
    const lockKey = `lock:${key}`;

    const result = (await this.redis.set(
      lockKey,
      'locked',
      'PX',
      ttl,
      'NX',
    )) as string | null;

    return result === 'OK';
  }

  async release(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await this.redis.del(lockKey);
  }
}
