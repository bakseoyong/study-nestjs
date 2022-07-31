import { PickType } from '@nestjs/swagger';
import { UserProfile } from 'src/entity/user-profile.entity';

export class UserProfileDto extends PickType(UserProfile, [
  'id',
  'uid',
  'role',
  'department',
] as const) {}
