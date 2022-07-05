import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ScrapBoardDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  boardId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
