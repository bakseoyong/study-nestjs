import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class UpdateUserDto extends PickType(User, [
  'uid',
  'password',
  'email',
  'phone',
] as const) {}
