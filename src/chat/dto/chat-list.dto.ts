import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ChatListDto {
  @IsString()
  @IsNotEmpty()
  partner: string;

  @IsDate()
  @IsNotEmpty()
  lastSended: Date;

  @IsString()
  lastContent: string;
}
