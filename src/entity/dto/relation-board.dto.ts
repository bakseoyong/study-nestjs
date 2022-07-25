import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { BoardHashtag } from '../board-hashtag.entity';
import { Comment } from '../comment.entity';

export class RelationBoardDto {
  id: number;

  user: UserActivityDto;

  title: string;

  content: string;

  likeCount: number;

  viewCount: number;

  created: Date;

  updated: Date;

  deleted: Date;

  boardHashtag: BoardHashtag[];

  comments: Comment[];
}
