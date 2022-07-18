import { PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { BoardHashtag } from 'src/entity/board-hashtag.entity';
import { BoardDto } from 'src/entity/dto/board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';

export class CreateBoardHashtagDto {
  @IsNotEmpty()
  board: BoardDto;

  @IsArray()
  @IsOptional()
  hashtags: Hashtag[];
}
