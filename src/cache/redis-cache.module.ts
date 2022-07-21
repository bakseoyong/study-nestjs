import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: '127.0.0.1',
        port: 6379,
        ttl: 60 * 11,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
