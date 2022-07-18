import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';
import { UserActivity } from './user-activity.entity';

@Entity({ name: 'scraps' })
@Unique(['id'])
export class Scrap extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: 'board Id' })
  boardId: number;

  // @Column({ type: 'varchar', comment: 'commenter' })
  // userId: string;

  // @ManyToOne((type) => Board, (board) => board.scrap)
  // board: Board;

  @ManyToOne((type) => Board, (board) => board.scraps)
  @ApiProperty({ type: Board })
  board: Board;

  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.scraps)
  user: UserActivity;
}
