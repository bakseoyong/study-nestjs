import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PagenationBoardsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  count: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  page: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  likes: boolean;
}
