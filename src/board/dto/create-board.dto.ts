import { PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Board } from 'src/entity/board.entity';

//PickType Board를 하면 안되지. 생성하는 DTO인데 Board를 의존하는게
// export class CreateBoardDto extends PickType(Board, [
//   'title',
//   'content',
// ] as const) {
//   @IsArray()
//   @IsOptional()
//   tagNames: string[];
// }

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  tagNames: string[];
}
