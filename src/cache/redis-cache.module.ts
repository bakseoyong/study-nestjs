import { CacheModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';

const cacheModule = CacheModule.registerAsync({
  useFactory: () => ({
    store: redisStore,
    host: '127.0.0.1',
    port: 6379,
    ttl: 60,
  }),
});

@Module({
  providers: [CacheService],
  exports: [cacheModule],
})
export class RedisCacheModule {}
