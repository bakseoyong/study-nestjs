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
import { map } from 'rxjs';
import { NotificationType } from 'src/entity/notification.entity';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/view/:id')
  //@Render('view.ejs')
  getBoardById(@Param('id') id: number): Promise<InitViewDto> {
    return this.boardService.getBoardById(id);
  }

  @Post('/create-board')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  //createBoard(@Body() createBoardDto: CreateBoardDto): Promise<boolean> {
  //return this.boardService.createBoard(createBoardDto);
  async createBoard(@Body() body, @Req() req): Promise<any> {
    const createBoardDto: CreateBoardDto = {
      title: body.title,
      content: body.content,
      author: req.user.no,
    };

    const board = await this.boardService.createBoard(createBoardDto);

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

  @Get('/author-undefined/:id')
  @UsePipes(ValidationPipe)
  setAuthorUndefined(@Param('id') userId: string): Promise<boolean> {
    return this.boardService.setAuthorUndefined(userId);
  }

  @Get('/written-boards/:id')
  @UsePipes(ValidationPipe)
  findByUserId(@Param('id') userId: string): Promise<Board[]> {
    return this.boardService.findByUserId(userId);
  }

  @Get('/recommend-board/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  recommendBoard(@Param('id') id: number, @Req() req): Promise<number> {
    return this.boardService.recommendBoard(id, req.user.no);
  }

  @Get('/hot-boards/:date')
  @UsePipes(ValidationPipe)
  findMoreThan10Likes(@Param('date') date: string): Promise<Board[]> {
    return this.boardService.findMoreThan10Likes(date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/report-board/:id')
  @UsePipes(ValidationPipe)
  reportBoard(@Param('id') id: number, @Req() req): Promise<boolean> {
    return this.boardService.reportBoard(id, req.user.no);
  }

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

  @Get('/popular-boards')
  @UsePipes(ValidationPipe)
  getPopularBoards(): Promise<Board[]> {
    return this.boardService.getPopularBoards();
  }

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
  }

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

  @Get('/my-scrap-boards')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  getScrapBoardsFindByUserId(@Req() req): Promise<any> {
    return this.boardService.getScrapBoardsFindByUserId(req.user.no);
  }
}
