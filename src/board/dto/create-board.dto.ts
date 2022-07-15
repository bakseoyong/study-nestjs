import { PickType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { Board } from 'src/entity/board.entity';

export class CreateBoardDto extends PickType(Board, [
  'title',
  'content',
] as const) {
  @IsArray()
  @IsOptional()
  tagNames: string[];
}
