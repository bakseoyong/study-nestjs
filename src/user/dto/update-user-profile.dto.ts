import { PickType } from '@nestjs/swagger';
import { UserProfile } from 'src/entity/user-profile.entity';

export class UpdateUserProfileDto extends PickType(UserProfile, [
  'id', // uid X. 아이디 변경은 없으므로
  'password',
  'email',
  'phone',
] as const) {}
