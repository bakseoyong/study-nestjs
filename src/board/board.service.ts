import {
  CACHE_MANAGER,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { RelationBoardDto } from 'src/entity/dto/relation-board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { Scrap } from 'src/entity/scrap.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { CreateBoardHashtagDto } from 'src/hashtag/dto/create-hashtag-board.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { UserActivityBoardDto } from 'src/user/dto/user-activity-board.dto';
import { UserService } from 'src/user/user.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,

    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly notificationService: NotificationService,

    @Inject(CACHE_MANAGER) private readonly cacheMananger: Cache,
  ) {}

  async getById(boardId: number): Promise<BoardDto> {
    const boardDto: BoardDto = await this.boardRepository.getById(boardId);
    return boardDto;
  }

  getRelationById(boardId: number): Promise<RelationBoardDto> {
    return this.boardRepository.getById(boardId);
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<BoardDto> {
    const hashtags: Hashtag[] = await this.hashtagService.findOrCreateHashtags(
      createBoardDto.tagNames,
    );

    const board: BoardDto = await this.boardRepository.createBoard(
      createBoardDto,
    );

    const createBoardHashtagDto: CreateBoardHashtagDto = { board, hashtags };

    await this.hashtagService.createBoardHashtags(createBoardHashtagDto);

    const followDtos = await this.userService.getFollowers(userId);
    if (!followDtos.followers) {
      return board;
    }
    const receivers = followDtos.followers.map((follow) => follow.from);

    const createNotiDto: CreateNotiDto = {
      to: receivers,
      url: `http://localhost:3000/board/view/${board.id}`,
      from: board.user.id,
      notiType: NotificationType.FOLLWER_BOARD,
    };

    await this.notificationService.createNoti(createNotiDto);

    return board;
  }

  async setAuthorUndefined(userId: string): Promise<boolean> {
    const user: UserActivityBoardDto =
      await this.userService.getActivityBoardById(userId);
    return this.boardRepository.updateAuthorUndefined(user);
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

  async getAuthorById(boardId: number): Promise<string> {
    return (await this.boardRepository.getUserById(boardId)).id;
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
    return true;
  }

  likeBoard(boardId: number): Promise<boolean> {
    return this.boardRepository.likeBoard(boardId);
  }

  async viewBoard(boardId: number): Promise<number> {
    let viewCnt: number = await this.cacheMananger.get(`viewCnt:${boardId}`);
    let saved: Date = await this.cacheMananger.get(`saved:${boardId}`);
    if (!viewCnt) {
      const board = await this.boardRepository.getById(boardId);
      viewCnt = board.viewCount;
      saved = new Date();
      await this.cacheMananger.set(`saved:${boardId}`, saved);
    }
    if (new Date().getTime() - saved.getTime() >= 1000 * 60 * 10) {
      const board = await this.boardRepository.getById(boardId);
      board.viewCount = viewCnt;
      board.save();
      this.cacheMananger.del(`viewCnt:${boardId}`);
      this.cacheMananger.set(`saved:${boardId}`, new Date().getTime());
    }
    //Logger.log(saved);
    await this.cacheMananger.set(`viewCnt:${boardId}`, viewCnt + 1);
    return viewCnt + 1;
  }
}
