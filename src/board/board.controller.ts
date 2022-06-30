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
  Logger,
} from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PagenationBoardsDto } from './dto/pagenation-boards.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/view/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardService.getBoardById(id);
  }

  @Post('/create-board')
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<boolean> {
    return this.boardService.createBoard(createBoardDto);
  }

  // @Post('/create-auth-board')
  // @UsePipes(ValidationPipe)
  // createAuthBoard(
  //   @Body() createAuthBoardDto: CreateAuthBoardDto,
  // ): Promise<boolean> {
  //   return this.boardService.createAuthBoard(createAuthBoardDto);
  // }

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

  // @Get('/list')
  // @UsePipes(ValidationPipe)
  // loadPagenationBoards(@Query() query: PagenationBoardsDto): Promise<Board[]> {
  //   return this.boardService.loadPagenationBoards(query);
  // }

  //좋아요 순 정렬까지는 만들어야 되지 않나 싶다. > 뒤에 쿼리형식으로 붙을텐데 > isOptional한다음에

  //5개 이상 신고된 게시글을 보는거는 관리자만 가능한 기능 // jwt에서 관리자는 어떤 차별점을 줄 수 있는지에 대해 생각해봐야한다.
  //jwt payload에 role집어넣느거 먼저

  // @Get('/report-list')
  // @Roles([Role.ADMIN])
  // @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // reportMoreThan5boards(): Promise<Board[]> {
  //   return this.boardService.findMoreThan5Reports();
  // }
}
