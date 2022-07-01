import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SortType {
  LIKES = 'LIKES',
  NEWLY = 'NEWLY',
}

export class PaginationBoardDto {
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  cursor: string;

  @IsEnum(SortType)
  @IsNotEmpty()
  type: SortType;
}
