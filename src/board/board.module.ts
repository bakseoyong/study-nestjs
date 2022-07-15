import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from 'src/follow/follow.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { NotificationService } from 'src/notification/notification.service';
import { BoardHashtagRepository } from 'src/repository/board-hashtag.repository';
import { BoardRepository } from 'src/repository/board.repository';
import { CommentRepository } from 'src/repository/comment.repository';
import { FollowRepository } from 'src/repository/follow.repository';
import { HashtagRepository } from 'src/repository/hashtag.repository';
import { NotificationRepository } from 'src/repository/notification.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      BoardRepository,
      RecommendRepository,
      ReportRepository,
      CommentRepository,
      ScrapRepository,
      HashtagRepository,
      BoardHashtagRepository,
      NotificationRepository,
      FollowRepository,
    ]),
  ],
  providers: [BoardService, HashtagService, NotificationService, FollowService],
  controllers: [BoardController],
})
export class BoardModule {}
