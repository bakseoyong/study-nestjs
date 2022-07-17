import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { Scrap } from 'src/entity/scrap.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { FollowService } from 'src/follow/follow.service';
import { CreateBoardHashtagDto } from 'src/hashtag/dto/create-hashtag-board.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { UserService } from 'src/user/user.service';
import { getConnection } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly recommendRepository: RecommendRepository,
    private readonly reportRepository: ReportRepository,
    private readonly scrapRepository: ScrapRepository,

    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly notificationService: NotificationService,
    private readonly followService: FollowService,
  ) {}

  getById(boardId: number): Promise<BoardDto> {
    return this.boardRepository.getById(boardId);
  }

  findById(boardId: number): Promise<BoardDto> {
    return this.boardRepository.findById(boardId);
  }

  // async getBoardById(id: number): Promise<InitViewDto> {
  //   const queryRunner = await getConnection().createQueryRunner();
  //   await queryRunner.startTransaction();

  //   try {
  //     const board = await this.boardRepository.getBoardById(
  //       queryRunner.manager,
  //       id,
  //     );

  //     const comments = await this.commentRepository.getOldest20Comments(
  //       queryRunner.manager,
  //       id,
  //     );

  //     const initViewDto: InitViewDto = { board: board, comments: comments };

  //     await queryRunner.commitTransaction();

  //     return initViewDto;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     Logger.log(error);
  //   }
  // }

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<Board> {
    const hashtags: Hashtag[] = await this.hashtagService.findOrCreateHashtags(
      createBoardDto.tagNames,
    );

    const board = await this.boardRepository.createBoard(createBoardDto);

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

    return board;
  }

  setAuthorUndefined(userId: string): Promise<boolean> {
    return this.boardRepository.updateAuthorUndefined(userId);
  }

  findByUserId(userId: string): Promise<BoardDto[]> {
    return this.boardRepository.findByUserId(userId);
  }

  async recommendBoard(id: number, recommender: string): Promise<number> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      this.recommendRepository.createRecommend(
        queryRunner.manager,
        id,
        recommender,
      );
      const likes = await this.boardRepository.recommendBoard(
        queryRunner.manager,
        id,
      );
      await queryRunner.commitTransaction();

      return likes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.log(error);
    }
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

  reportBoard(id: number, reporter: string): Promise<boolean> {
    return this.reportRepository.createReport(id, reporter);
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

  getScrapBoardsFindByUserId(userId: string): Promise<any> {
    // const queryRunner = await getConnection().createQueryRunner();
    // await queryRunner.startTransaction();

    // try {
    return this.scrapRepository.findScrapsByUserId(userId);
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   Logger.log(error);
    // }
  }

  getAuthorById(boardId: number): Promise<string> {
    return this.boardRepository.getAuthorById(boardId);
  }

  async updateBoard(
    userId: string,
    updateBoardDto: UpdateBoardDto,
    boardId: number,
  ): Promise<boolean> {
    const board = await this.boardRepository.updateBoard(
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
