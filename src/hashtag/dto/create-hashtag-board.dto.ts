import { PickType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { BoardHashtag } from 'src/entity/board-hashtag.entity';
import { Hashtag } from 'src/entity/hashtag.entity';

export class CreateBoardHashtagDto extends PickType(BoardHashtag, [
  'board',
] as const) {
  @IsArray()
  @IsOptional()
  hashtags: Hashtag[];
}
