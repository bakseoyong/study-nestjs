import { PickType } from '@nestjs/swagger';
import { UserProfile } from 'src/entity/user-profile.entity';

export class CreateUserDto extends PickType(UserProfile, [
  'uid',
  'password',
  'email',
  'phone',
] as const) {}
