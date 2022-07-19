import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';

export class CreateNotiDto {
  @IsString()
  @IsNotEmpty()
  to: UserActivityDto[];

  @IsString()
  @IsNotEmpty()
  url: string;

  //from not relation mapping
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsNumber()
  @IsNotEmpty()
  notiType: number;
}
