import { PickType } from '@nestjs/swagger';
import { UserActivity } from 'src/entity/user-activity.entity';

export class ChatRoomsDto extends PickType(UserActivity, [
  'chatRooms',
] as const) {}
