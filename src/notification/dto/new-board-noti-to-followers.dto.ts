import { IsNotEmpty, IsString } from 'class-validator';

export class NewBoardNotiToFollowersDto {
  @IsString()
  @IsNotEmpty()
  receivers: string[];

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  creator: string;
}
