import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: '댓글 작성 API',
    description: '게시글에 댓글을 작성합니다.',
  })
  @Post('/create-comment/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createComment(
    @Param() param,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ): Promise<boolean> {
    return this.commentService.createComment(
      param.id,
      createCommentDto,
      req.user.id,
    );
  }
}
