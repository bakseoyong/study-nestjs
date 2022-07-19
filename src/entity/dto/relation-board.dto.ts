import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { BoardHashtag } from '../board-hashtag.entity';
import { Comment } from '../comment.entity';

export class RelationBoardDto {
  id: number;

  user: UserActivityDto;

  likes: number;

  title: string;

  content: string;

  created: Date;

  updated: Date;

  deleted: Date;

  boardHashtag: BoardHashtag[];

  comments: Comment[];
}
