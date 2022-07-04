import { IsNotEmpty } from 'class-validator';

export class ScrapBoardDto {
  @IsNotEmpty()
  boardId: number;

  @IsNotEmpty()
  userId: string;
}
