import { PickType } from '@nestjs/swagger';
import { UserProfile } from 'src/entity/user-profile.entity';

export class LoginUserDto extends PickType(UserProfile, [
  'uid',
  'password',
] as const) {}
