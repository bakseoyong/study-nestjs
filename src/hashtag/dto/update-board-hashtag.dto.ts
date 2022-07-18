import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { BoardDto } from 'src/entity/dto/board.dto';
import { Hashtag } from 'src/entity/hashtag.entity';

export class UpdateBoardHashtagDto {
  @IsNotEmpty()
  board: BoardDto;

  @IsArray()
  @IsOptional()
  hashtags: Hashtag[];
}
