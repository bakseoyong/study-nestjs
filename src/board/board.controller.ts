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
  Logger,
} from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationBoardDto } from './dto/pagination-boards.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardDto } from 'src/entity/dto/board.dto';
import { RelationBoardDto } from 'src/entity/dto/relation-board.dto';

@ApiTags('게시글 API')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시글 조회 API',
    description: '게시글을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '게시글을 조회합니다.', type: User })
  @Get('/view/:id')
  //@Render('view.ejs')
  async getRelationById(@Param('id') id: number): Promise<RelationBoardDto> {
    const viewCount = await this.boardService.viewBoard(id);
    Logger.log(viewCount);
    return this.boardService.getRelationById(id);
  }

  @ApiOperation({
    summary: '게시글 생성 API',
    description: '게시글을 생성합니다.',
  })
  @Post('/create-board')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req,
  ): Promise<BoardDto> {
    return this.boardService.createBoard(createBoardDto, req.user.id);
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
  findByUserId(@Param('id') userId: string): Promise<BoardDto[]> {
    return this.boardService.findByUserId(userId);
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
    summary: '게시글 스크랩 API',
    description: '게시글을 스크랩합니다.',
  })
  @Get('/scrap-board/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  scrapBoard(@Param() param, @Req() req): Promise<boolean> {
    const scrapBoardDto: ScrapBoardDto = {
      boardId: param.id,
      userId: req.user.id,
    };
    return this.boardService.scrapBoard(scrapBoardDto);
  }

  @ApiOperation({
    summary: '게시글 수정 API',
    description: '작성한 게시글을 수정합니다.',
  })
  @Post('/update/:id')
  @UseGuards(JwtAuthGuard)
  updateBoard(
    @Req() req,
    @Body() updateBoardDto: UpdateBoardDto,
    @Param() param,
  ): Promise<boolean> {
    return this.boardService.updateBoard(req.user.id, updateBoardDto, param.id);
  }

  @ApiOperation({
    summary: '게시글 좋아요 API',
    description: '게시글을 추천합니다',
  })
  @Get('/like/:id')
  @UseGuards(JwtAuthGuard)
  likeBoard(@Req() req, @Param('id') boardId): void {
    // return this.boardService.likeBoard(req.user.id, boardId);
  }
}
