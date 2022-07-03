import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  // 파람으로 보드아이디 받고, 내용만 넣으면 될듯
  @IsString()
  @IsNotEmpty()
  boardId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @IsString()
  @IsNotEmpty()
  commenter: string;
}
