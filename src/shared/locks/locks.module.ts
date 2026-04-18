import { Global, Module } from '@nestjs/common';
import { LOCK_SERVICE } from './token';
import { RedisLockService } from './redis-lock.service';

@Global()
@Module({
  providers: [
    {
      provide: LOCK_SERVICE,
      useClass: RedisLockService,
    },
  ],
  exports: [LOCK_SERVICE],
})
export class LocksModule {}
