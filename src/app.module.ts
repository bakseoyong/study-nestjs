import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { EventsGateway } from './events/gateway';
import { SseModule } from './sse/sse.module';
import { NotificationModule } from './notification/notification.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { FollowModule } from './follow/follow.module';
import { UploadModule } from './upload/upload.module';
import { NoteModule } from './note/note.module';
import { CommentModule } from './comment/comment.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        url: 'redis://127.0.0.1:6379',
      },
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    BoardModule,
    SseModule,
    NotificationModule,
    HashtagModule,
    FollowModule,
    UploadModule,
    //CacheModule.register(),
    NoteModule,
    CommentModule,
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
