import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BoardService } from 'src/board/board.service';
import { Board } from 'src/entity/board.entity';
import { Comment } from 'src/entity/comment.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { CommentRepository } from 'src/repository/comment.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
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

  async create(
    boardId: number,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<boolean> {
    const boardDto = await this.boardService.getById(boardId);
    const user: UserActivity = await this.userActivityRepository.findOne(
      userId,
    );
    const { content } = createCommentDto;

    const comment = new Comment();
    //getById를 다시 dto로 바꾸면서 생긴 문제
    //일단 board로 바꾸고 manyToOne으로 브랜치 만들어서 수정하면 그때 해도 될것같다.
    comment.board = Board.from(boardDto);
    comment.user = user;
    comment.content = content;
    this.commentRepository.save(comment);

    const followers = user.followers.map((follow) =>
      UserActivity.to(follow.from),
    );

    const createNotiDto: CreateNotiDto = {
      to: followers,
      url: `http://localhost:3000/view/board/${boardId}`,
      from: userId,
      notiType: NotificationType.WRITE_BOARD_COMMENT,
    };

    await this.notificationService.create(createNotiDto);

    return true;
  }
}
