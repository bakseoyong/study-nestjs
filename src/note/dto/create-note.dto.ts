import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/entity/user.entity';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @IsNotEmpty()
  receiver: User;
}
