import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/cache/redis-cache.module';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { NotificationModule } from 'src/notification/notification.module';
import { BoardRepository } from 'src/repository/board.repository';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    HashtagModule,
    NotificationModule,
    UserModule,
    TypeOrmModule.forFeature([BoardRepository]),
    CacheModule.register({
      ttl: 60 * 11,
    }),
  ],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService, TypeOrmModule],
})
export class BoardModule {}
