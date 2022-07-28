import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { EventsGateway } from './events/gateway';
import { NotificationModule } from './notification/notification.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { FollowModule } from './follow/follow.module';
import { UploadModule } from './upload/upload.module';
import { ChatModule } from './chat/chat.module';
import { CommentModule } from './comment/comment.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SseModule } from './sse/sse.module';
import { ScrapModule } from './scrap/scrap.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    BoardModule,
    SseModule,
    NotificationModule,
    HashtagModule,
    FollowModule,
    UploadModule,
    RedisModule.forRoot({
      config: {
        url: 'localhost:6379',
      },
    }),
    ChatModule,
    CommentModule,
    ScrapModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
