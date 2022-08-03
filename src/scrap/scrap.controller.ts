import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScrapDto } from 'src/scrap/dto/create-scrap.dto';
import { ScrapService } from './scrap.service';

@Controller('scrap')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @ApiOperation({
    summary: '게시글 스크랩 API',
    description: '게시글을 스크랩합니다.',
  })
  @Get('/create/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  create(@Param() param, @Req() req): Promise<boolean> {
    const createScrapDto: CreateScrapDto = {
      boardId: param.id,
      userId: req.user.id,
    };
    return this.scrapService.create(createScrapDto);
  }

  @ApiOperation({
    summary: '게시글 스크랩 해제 API',
    description: '게시글 스크랩을 해제합니다.',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  delete(@Param('id') boardId, @Req() req): Promise<boolean> {
    return this.scrapService.delete(boardId, req.user.id);
  }
}
