import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { RelationBoardDto } from 'src/entity/dto/relation-board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';
import { NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { Department } from 'src/entity/user-profile.entity';
import { CreateBoardHashtagDto } from 'src/hashtag/dto/create-hashtag-board.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BoardRepository } from 'src/repository/board.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { UserService } from 'src/user/user.service';
import { MoreThanOrEqual } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userActivityRepository: UserActivityRepository,

    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly notificationService: NotificationService, // @Inject(CACHE_MANAGER) private readonly cacheMananger: Cache, //private readonly redisCacheService: RedisCacheService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getById(boardId: number): Promise<BoardDto> {
    return await this.boardRepository.getById(boardId);
  }

  //getRelationById도 결국 getById에 viewcount더한건데 getById를
  //여기서 발전해서 학과 인원들만 들어갈 수 있는 학과 전용 게시판 만들어도 괜찮겠다.
  //일단 board말고 없는 것 같고, null이 가능한 컬럼으로 설정하고
  //우선 redis에서 적합한 자료구조를 찾아보자
  //getRelationById를 글을 렌더링 할 때만 조회하는게 아니므로 viewboard도 user정보가 필요했다.
  async getRelationById(
    boardId: number,
    user?: any,
  ): Promise<RelationBoardDto> {
    const relationBoardDto: RelationBoardDto =
      await this.boardRepository.getById(boardId);

    if (user) {
      //유저 정보가 필요하지 않지만 getRelationById를 호출하는 목적에 따라 구분하기 위함
      const viewCount = await this.viewBoard(boardId);
      const hotDept = await this.getHotDept(boardId, user.dept);
      relationBoardDto.viewCount = viewCount;
    }

    return relationBoardDto;
  }

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<BoardDto> {
    const hashtags: Hashtag[] = await this.hashtagService.findOrCreateHashtags(
      createBoardDto.tagNames,
    );

    const user = await this.userActivityRepository.findOne(userId);

    const { title, content, ...other } = createBoardDto;

    const board = new Board();
    board.user = user;
    board.title = title;
    board.content = content;
    await this.boardRepository.save(board);

    const createBoardHashtagDto: CreateBoardHashtagDto = { board, hashtags };

    await this.hashtagService.createBoardHashtags(createBoardHashtagDto);

    const receivers = user.getFollowers().map((follow) => follow.from);

    const createNotiDto: CreateNotiDto = {
      to: receivers,
      url: `http://localhost:3000/board/view/${board.id}`,
      from: board.user.id,
      notiType: NotificationType.FOLLWER_BOARD,
    };

    await this.notificationService.create(createNotiDto);

    return board;
  }

  async setAuthorUndefined(userId: string): Promise<boolean> {
    const user = await this.userActivityRepository.findOne(userId);

    user.getBoards().map((board) => {
      board.user = null;
      this.boardRepository.save(board);
    });

    return true;
  }

  async findMoreThan10Likes(date: string): Promise<Board[]> {
    const boards = this.redis.get('findMoreThan10Likes');
    if (!boards) {
      const stringToDate = new Date(date);
      const dateFormatter = (date) => date.toISOString().slice(0, 10);
      Logger.log(
        `findMoreThan10Likes Service Layer : ${dateFormatter(stringToDate)}`,
      );
      const result = await this.boardRepository.find({
        where: {
          likes: MoreThanOrEqual(10),
          created: dateFormatter(stringToDate),
        },
      });
      this.redis.set('findMoreThan10Likes', JSON.stringify(result));
      return result;
    } else {
      return JSON.parse(boards);
    }
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

  async getPopularBoards(): Promise<BoardDto[]> {
    const date = new Date();
    date.setHours(date.getHours() - 1);

    return await this.boardRepository.find({
      where: {
        likes: MoreThanOrEqual(5),
        created: MoreThanOrEqual(date),
      },
    });
  }

  async getAuthorById(boardId: number): Promise<string> {
    return (await this.boardRepository.getUserById(boardId)).id;
  }

  async update(
    updateBoardDto: UpdateBoardDto,
    boardId: number,
  ): Promise<boolean> {
    const board = await this.boardRepository.getById(boardId);
    const { title, content, ...other } = updateBoardDto;
    board.title = title;
    board.content = content;
    this.boardRepository.save(board);

    const hashtags = await this.hashtagService.findOrCreateHashtags(
      updateBoardDto.postTagNames,
    );

    this.hashtagService.updateBoardHashtags({ board, hashtags });
    return true;
  }

  async likeBoard(userId: string, boardId: number): Promise<number> {
    this.redis.sadd(`likes:${boardId}`, userId);
    return this.redis.scard(`likes:${boardId}`);
  }

  async viewBoard(boardId: number): Promise<number> {
    //어느정도 유실되어도 된다.
    let viewCnt: number = +(await this.redis.get(`viewCnt:${boardId}`));
    let saved: Date = new Date(await this.redis.get(`saved:${boardId}`));
    if (!viewCnt) {
      const board = await this.boardRepository.getById(boardId);
      viewCnt = board.viewCount;
      saved = new Date();
      await this.redis.set(`saved:${boardId}`, saved.toString());
    }
    if (new Date().getTime() - saved.getTime() >= 1000 * 60 * 10) {
      const board = await this.boardRepository.getById(boardId);
      board.viewCount = viewCnt;
      board.save();
      this.redis.del(`viewCnt:${boardId}`);
      this.redis.set(`saved:${boardId}`, new Date().getTime());
    }
    //Logger.log(saved);
    await this.redis.set(`viewCnt:${boardId}`, viewCnt + 1);
    return viewCnt + 1;
  }

  async checkAuthor(userId: string, boardId: number): Promise<boolean> {
    const user: UserActivityDto = await this.userService.getActivityById(
      userId,
    );

    const board = await this.boardRepository.getById(boardId);

    if (user === UserActivity.to(board.user)) {
      return true;
    } else {
      throw new BadRequestException();
    }
  }

  async getHotDept(boardId: number, dept: Department): Promise<string> {
    let deptStr: string = this.redis.get(`deptStr:${boardId}`);
    if (!deptStr) {
      this.redis.set(`deptStr:${boardId}`, `${dept} `);
      return null;
    }
    const deptArr: string[] = deptStr.split(' ');
    const counts = deptArr.reduce((pv, cv) => {
      pv[cv] = (pv[cv] || 0) + 1;
      return pv;
    }, {});
    const keys = Object.keys(counts);
    let mode = keys[0];
    keys.forEach((val, idx) => {
      if (counts[val] > counts[mode]) {
        mode = val;
      }
    });

    deptStr = deptStr + `${dept} `;
    this.redis.set(`deptStr:${boardId}`, deptStr);

    return Object.keys(Department)[Object.values(Department).indexOf(mode)];
  }
}
