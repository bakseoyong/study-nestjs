import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class LoginUserDto extends PickType(User, [
  'uid',
  'password',
] as const) {}
