import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BoardService } from 'src/board/board.service';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { CommentRepository } from 'src/repository/comment.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userActivityRepository: UserActivityRepository,

    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
    private readonly notificationService: NotificationService,
  ) {}

  async createComment(
    boardId: number,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<boolean> {
    const boardDto: BoardDto = await this.boardService.getById(boardId);
    const userActivityDto: UserActivityDto =
      await this.userActivityRepository.getById(userId);
    const { content } = createCommentDto;
    const board = Board.from(boardDto);
    const user = UserActivity.from(userActivityDto);

    this.commentRepository.createComment(board, content, user);

    const followers = user.followers.map((follow) =>
      UserActivity.to(follow.from),
    );

    const createNotiDto: CreateNotiDto = {
      to: followers,
      url: `http://localhost:3000/view/board/${boardId}`,
      from: userId,
      notiType: NotificationType.WRITE_BOARD_COMMENT,
    };

    await this.notificationService.createNoti(createNotiDto);

    return true;
  }
}
