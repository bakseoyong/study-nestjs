import { PickType } from '@nestjs/swagger';
import { UserActivity } from 'src/entity/user-activity.entity';

export class UserActivityBoardDto extends PickType(UserActivity, [
  'id',
  'boards',
]) {}
