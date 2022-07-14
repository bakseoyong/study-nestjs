import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Hashtag } from 'src/entity/hashtag.entity';
import { HashtagService } from './hashtag.service';

@ApiTags('해시태그 API')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @ApiOperation({
    summary: '해시태그 조회 or 생성 API',
    description: '해시태그가 있다면 조회, 없다면 추가합니다.',
  })
  @Post('/find-or-create')
  findOrCreateHashtags(@Body() body): Promise<Hashtag[]> {
    return this.hashtagService.findOrCreateHashtags(body.tagNames);
  }

  @ApiOperation({
    summary: '게시글-해시태그 관계 테이블 추가 API',
    description:
      '게시글이 생성된 경우 함께 작성된 해시태그들과의 관계 테이블을 생성합니다.',
  })
  @Post('/create-board-hashtag')
  createBoardHashtag(@Body() body): Promise<boolean> {
    return this.hashtagService.createBoardHashtag(body);
  }
}
