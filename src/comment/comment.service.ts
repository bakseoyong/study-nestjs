import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { Follow } from 'src/entity/follow.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { User } from 'src/entity/user.entity';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { CommentRepository } from 'src/repository/comment.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
    private readonly userActivityRepository: UserActivityRepository,

    private readonly notificationService: NotificationService,
  ) {}

  async createComment(
    boardId: number,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<boolean> {
    const boardDto: BoardDto = await this.boardRepository.getById(boardId);
    const userActivityDto: UserActivityDto =
      await this.userActivityRepository.getById(userId);
    const { content } = createCommentDto;
    const board = Board.from(boardDto);
    const user = UserActivity.from(userActivityDto);

    this.commentRepository.createComment(board, content, user);

    const followers = user.followers.map((follow) => follow.from);

    const createNotiDto: CreateNotiDto = {
      receivers: followers,
      url: `http://localhost:3000/view/board/${boardId}`,
      creator: userId,
      notiType: NotificationType.WRITE_BOARD_COMMENT,
    };

    await this.notificationService.createNoti(createNotiDto);

    return true;
  }
}
