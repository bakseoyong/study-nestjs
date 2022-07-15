import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Hashtag } from 'src/entity/hashtag.entity';
import { CreateBoardHashtagDto } from './dto/create-hashtag-board.dto';
import { UpdateBoardHashtagDto } from './dto/update-board-hashtag.dto';
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
  createBoardHashtags(
    @Body() createBoardHashtagDto: CreateBoardHashtagDto,
  ): Promise<boolean> {
    return this.hashtagService.createBoardHashtags(createBoardHashtagDto);
  }

  //태그된 게시물 보여주기 => board에서 해야 겠다.

  //해시태그 변경 => 변경되어서 게시글이 출력되는 정렬은 최신순이여야 됨.
  //1. 기존 생성할때 해시태그들을 삭제하고 다시 추가하자 -> 단순함. 태그된 게시글들을 조회할때는 날짜순으로 정렬하면 됨, 너무 단순해서 걱정됨
  //2. 수정할때 기존의 tagNames들을 저장하고 새로 변경된 tagNames들과 비교해서 추가된건 추가, 삭제된건 삭제하기 -> 구현하기 귀찮긴한데 가능함
  // 2에서 빠르게 탐색할 수 있는 알고리즘 찾아보자
  //보드에서는 수정할때 기존의 tagNames들을 저장하고 있어야 된다. => updateboard도 없었음...
  //여기 => updateboard
  @ApiOperation({
    summary: '게시글-해시태그 관계 테이블 수정 API',
    description:
      '게시글에 포함된 해시태그들이 수정된 경우 관계 테이블을 수정합니다.',
  })
  @Post('/update-board-hashtags')
  updateBoardHashtags(
    @Body() updateBoardHashtagDto: UpdateBoardHashtagDto,
  ): Promise<boolean> {
    return this.hashtagService.updateBoardHashtags(updateBoardHashtagDto);
  }

  //트위터에서 많은 사람들의 관심을 받는 해시태그 문구를 인기토픽이라고 한다고 한다. 이것도 구현

  @Delete('/delete-board-hashtags/:id')
  deleteBoardHashtags(@Param() param): Promise<boolean> {
    return this.hashtagService.deleteBoardHashtags(param.id);
  }
}
