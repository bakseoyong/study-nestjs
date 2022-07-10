import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  Patch,
} from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationBoardDto } from './dto/pagination-boards.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InitViewDto } from './dto/init-view.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs';
import { NotificationType } from 'src/entity/notification.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { Hashtag } from 'src/entity/hashtag.entity';

@ApiTags('게시글 API')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly httpService: HttpService, //private readonly hashtagService: HashtagService,
  ) {}

  @ApiOperation({
    summary: '게시글 조회 API',
    description: '게시글을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '게시글을 조회합니다.', type: User })
  @Get('/view/:id')
  //@Render('view.ejs')
  getBoardById(@Param('id') id: number): Promise<InitViewDto> {
    return this.boardService.getBoardById(id);
  }

  @ApiOperation({
    summary: '게시글 생성 API',
    description: '게시글을 생성합니다.',
  })
  @Post('/create-board')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createBoard(@Body() body, @Req() req): Promise<any> {
    const hashtags: Hashtag[] = await this.httpService
      .post(`http://localhost:3000/hashtag/find-or-create`, body.tagNames)
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
      )[0];

    const createBoardDto: CreateBoardDto = {
      title: body.title,
      content: body.content,
      author: req.user.no,
    };

    const board = await this.boardService.createBoard(createBoardDto);

    //board - hashtag
    await this.httpService.post(
      `http://localhost:3000/hashtag/create-board-hashtag`,
      { board, hashtags },
    );

    //Observable<AxiosResponse<Object[]>>
    const author = await this.httpService.get(
      `http://localhost:3000/user/followers/${req.user.no}`,
    );

    const followers = author.pipe(map((response) => response.data))[0].follower;

    const data = {
      followers: followers,
      url: `http://localhost:3000/board/view/${board.id}`,
      creator: board.author,
    };

    await this.httpService.post(
      `http://localhost:3000/notification/following-new-board`,
      data,
    );
  }

  @ApiOperation({
    summary: '게시글 작성자 익명 전환 API',
    description:
      '게시글 작성자가 계정을 삭제한 경우 게시글 작성자를 익명으로 전환합니다.',
  })
  @Patch('/author-undefined/:id')
  @UsePipes(ValidationPipe)
  setAuthorUndefined(@Param('id') userId: string): Promise<boolean> {
    return this.boardService.setAuthorUndefined(userId);
  }

  @ApiOperation({
    summary: '유저가 작성한 게시글 목록 API',
    description: '유저가 작성한 게시글 목록을 조회합니다.',
  })
  @Get('/written-boards/:id')
  @UsePipes(ValidationPipe)
  findByUserId(@Param('id') userId: string): Promise<Board[]> {
    return this.boardService.findByUserId(userId);
  }

  @ApiOperation({
    summary: '게시글 추천 API',
    description: '게시글을 추천합니다.',
  })
  @Get('/recommend-board/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  recommendBoard(@Param('id') id: number, @Req() req): Promise<number> {
    return this.boardService.recommendBoard(id, req.user.no);
  }

  @ApiOperation({
    summary: '날짜별 HOT게시글 조회 API',
    description:
      '요청된 날짜에 작성된 게시글 중 추천을 10개이상 받은 게시글을 조회합니다.',
  })
  @Get('/hot-boards/:date')
  @UsePipes(ValidationPipe)
  findMoreThan10Likes(@Param('date') date: string): Promise<Board[]> {
    return this.boardService.findMoreThan10Likes(date);
  }

  @ApiOperation({
    summary: '게시글 신고 API',
    description: '게시글을 신고합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/report-board/:id')
  @UsePipes(ValidationPipe)
  reportBoard(@Param('id') id: number, @Req() req): Promise<boolean> {
    return this.boardService.reportBoard(id, req.user.no);
  }

  @ApiOperation({
    summary: '게시글 페이지네이션 API',
    description: '커서기반 페이지네이션을 이용해 게시글들을 조회합니다',
  })
  @Get('/list')
  @UsePipes(ValidationPipe)
  getBoardsUsingCursor(@Query() query: PaginationBoardDto): Promise<Board[]> {
    return this.boardService.getBoardsUsingCursor(query);
  }

  //5개 이상 신고된 게시글을 보는거는 관리자만 가능한 기능 // jwt에서 관리자는 어떤 차별점을 줄 수 있는지에 대해 생각해봐야한다.
  //jwt payload에 role집어넣느거 먼저

  // @Get('/report-list')
  // @Roles([Role.ADMIN])
  // @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // reportMoreThan5boards(): Promise<Board[]> {
  //   return this.boardService.findMoreThan5Reports();
  // }

  @ApiOperation({
    summary: '인기 게시글 API',
    description:
      '한시간 전 작성된 게시글들 중 좋아요가 5개 이상인 게시글들을 조회합니다.',
  })
  @Get('/popular-boards')
  @UsePipes(ValidationPipe)
  getPopularBoards(): Promise<Board[]> {
    return this.boardService.getPopularBoards();
  }

  @ApiOperation({
    summary: '댓글 작성 API',
    description: '게시글에 댓글을 작성합니다.',
  })
  @Post('/create-comment/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createComment(
    @Param() param,
    @Body() data,
    @Req() req,
  ): Promise<boolean> {
    const createCommentDto: CreateCommentDto = {
      boardId: param.id,
      content: data.content,
      commenter: req.user.no,
    };
    await this.boardService.createComment(createCommentDto);

    const notiData = {
      //createComment가 board를 리턴하는게 이상하지. boardId로 유저 정보 가져오게 하자
      receivers: await this.boardService.getAuthorById(param.id),
      url: `http://localhost:3000/view/board/${param.id}`,
      creator: req.user.no,
      notiType: NotificationType.WRITE_BOARD_COMMENT,
    };

    //글 작성자에게 알림
    await this.httpService.post(
      `http://localhost:3000/notification/create`,
      notiData,
    );

    return true;
  }

  @ApiOperation({
    summary: '게시글 스크랩 API',
    description: '게시글을 스크랩합니다.',
  })
  @Get('/scrap-board/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  scrapBoard(@Param() param, @Req() req): Promise<boolean> {
    const scrapBoardDto: ScrapBoardDto = {
      boardId: param.id,
      userId: req.user.no,
    };
    return this.boardService.scrapBoard(scrapBoardDto);
  }

  @ApiOperation({
    summary: '스크랩 게시글 조회 API',
    description: '스크랩한 게시글들을 조회합니다.',
  })
  @Get('/my-scrap-boards')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  getScrapBoardsFindByUserId(@Req() req): Promise<any> {
    return this.boardService.getScrapBoardsFindByUserId(req.user.no);
  }
}
