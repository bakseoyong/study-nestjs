import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { EventsGateway } from './events/gateway';
import { SseModule } from './sse/sse.module';
import { NotificationModule } from './notification/notification.module';
import { HashtagModule } from './hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    BoardModule,
    SseModule,
    NotificationModule,
    HashtagModule,
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
