import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { Scrap } from 'src/entity/scrap.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { CreateBoardHashtagDto } from 'src/hashtag/dto/create-hashtag-board.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { UserService } from 'src/user/user.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => HashtagService))
    private readonly hashtagService: HashtagService,

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  getById(boardId: number): Promise<BoardDto> {
    return this.boardRepository.getById(boardId);
  }

  findById(boardId: number): Promise<BoardDto> {
    return this.boardRepository.findById(boardId);
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<Board> {
    const hashtags: Hashtag[] = await this.hashtagService.findOrCreateHashtags(
      createBoardDto.tagNames,
    );

    const board: BoardDto = await this.boardRepository.createBoard(
      createBoardDto,
    );

    const createBoardHashtagDto: CreateBoardHashtagDto = { board, hashtags };

    await this.hashtagService.createBoardHashtags(createBoardHashtagDto);

    const followDtos = await this.userService.getFollowers(userId);
    const receivers = followDtos.followers.map((follow) => follow.from);

    const createNotiDto: CreateNotiDto = {
      receivers: receivers,
      url: `http://localhost:3000/board/view/${board.id}`,
      creator: board.author,
      notiType: NotificationType.FOLLWER_BOARD,
    };

    await this.notificationService.createNoti(createNotiDto);

    const returnBoard = Board.from(board);
    return returnBoard;
  }

  setAuthorUndefined(userId: string): Promise<boolean> {
    return this.boardRepository.updateAuthorUndefined(userId);
  }

  findByUserId(userId: string): Promise<BoardDto[]> {
    return this.boardRepository.findByUserId(userId);
  }

  findMoreThan10Likes(date: string): Promise<Board[]> {
    const stringToDate = new Date(date);
    const dateFormatter = (date) => date.toISOString().slice(0, 10);
    Logger.log(
      `findMoreThan10Likes Service Layer : ${dateFormatter(stringToDate)}`,
    );
    return this.boardRepository.findMoreThan10Likes(
      dateFormatter(stringToDate),
    );
  }

  // findMoreThan5Reports(): Promise<Board[]> {
  //   return this.boardRepository.findMoreThan5Reports(dateFormatter());
  // }

  getBoardsUsingCursor(
    paginationBoardsDto: PaginationBoardDto,
  ): Promise<Board[]> {
    switch (paginationBoardsDto.type) {
      case SortType.LIKES: {
        return this.boardRepository.getSortedLikesBoards(paginationBoardsDto);
      }
      case SortType.NEWLY: {
        return this.boardRepository.getSortedNewlyBoards(paginationBoardsDto);
      }
    }
  }

  getPopularBoards(): Promise<Board[]> {
    return this.boardRepository.getPopularBoards();
  }

  async scrapBoard(scrapBoardDto: ScrapBoardDto): Promise<boolean> {
    const { userId, boardId } = scrapBoardDto;

    const scrap = new Scrap();
    const boardDto = await this.getById(boardId);
    const userActivityDto = await this.userService.getActivityById(userId);
    scrap.board = Board.from(boardDto);
    scrap.user = UserActivity.from(userActivityDto);
    scrap.save();
    return true;
  }

  getAuthorById(boardId: number): Promise<string> {
    return this.boardRepository.getAuthorById(boardId);
  }

  async updateBoard(
    userId: string,
    updateBoardDto: UpdateBoardDto,
    boardId: number,
  ): Promise<boolean> {
    const board: BoardDto = await this.boardRepository.updateBoard(
      userId,
      updateBoardDto,
      boardId,
    );

    const hashtags = await this.hashtagService.findOrCreateHashtags(
      updateBoardDto.postTagNames,
    );

    this.hashtagService.updateBoardHashtags({ board, hashtags });
    // this.hashtagService.deleteBoardHashtags(boardId);
    // this.hashtagService.createBoardHashtags();
    return true;
  }
}
