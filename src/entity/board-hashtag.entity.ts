import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';
import { Hashtag } from './hashtag.entity';

@Entity({ name: 'board_hashtag' })
@Unique(['id'])
export class BoardHashtag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne((type) => Board, (board) => board.boardHashtag)
  // @JoinColumn()
  // board: Board;

  // @ManyToOne((type) => Hashtag, (hashtag) => hashtag.boardHashtag)
  // @JoinColumn()
  // hashtag: Hashtag;
}
