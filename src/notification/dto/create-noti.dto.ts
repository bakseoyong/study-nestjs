import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotiDto {
  @IsString()
  @IsNotEmpty()
  receivers: string[];

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsNumber()
  @IsNotEmpty()
  notiType: number;
}
