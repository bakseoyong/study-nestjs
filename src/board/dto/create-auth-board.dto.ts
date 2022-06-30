import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthBoardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}
