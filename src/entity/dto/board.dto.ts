import { UserActivity } from '../user-activity.entity';

export class BoardDto {
  id: number;

  user: UserActivity;

  title: string;

  content: string;

  created: Date;

  updated: Date;

  deleted: Date;
}
