import { IsNotEmpty, IsOptional } from 'class-validator';
import { Board } from 'src/entity/board.entity';
import { Comment } from 'src/entity/comment.entity';

export class InitViewDto {
  @IsNotEmpty()
  board: Board;

  @IsOptional()
  comments: Comment[];
}
