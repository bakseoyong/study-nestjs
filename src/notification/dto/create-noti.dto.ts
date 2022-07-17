import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserActivity } from 'src/entity/user-activity.entity';

export class CreateNotiDto {
  @IsString()
  @IsNotEmpty()
  receivers: UserActivity[];

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
