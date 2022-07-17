import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { CommentRepository } from 'src/repository/comment.repository';
import { NotificationRepository } from 'src/repository/notification.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentRepository,
      BoardRepository,
      UserActivityRepository,
      NotificationRepository,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationService],
})
export class CommentModule {}
