import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from 'src/follow/follow.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { NotificationService } from 'src/notification/notification.service';
import { BoardHashtagRepository } from 'src/repository/board-hashtag.repository';
import { BoardRepository } from 'src/repository/board.repository';
import { FollowRepository } from 'src/repository/follow.repository';
import { HashtagRepository } from 'src/repository/hashtag.repository';
import { NotificationRepository } from 'src/repository/notification.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from 'src/user/user.service';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      BoardRepository,
      RecommendRepository,
      ReportRepository,
      ScrapRepository,
      HashtagRepository,
      BoardHashtagRepository,
      NotificationRepository,
      FollowRepository,
      UserRepository,
      UserProfileRepository,
      UserActivityRepository,
    ]),
  ],
  providers: [
    BoardService,
    HashtagService,
    NotificationService,
    FollowService,
    UserService,
  ],
  controllers: [BoardController],
})
export class BoardModule {}
