import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { UserActivity } from './user-activity.entity';

@Entity({ name: 'comments' })
@Unique(['id'])
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;

  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.comments)
  user: UserActivity;

  @Column({ type: 'varchar', comment: 'content' })
  content: string;

  @Column({ type: 'integer', default: 0, comment: 'likes' })
  likes: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
