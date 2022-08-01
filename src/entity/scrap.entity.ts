import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  JoinColumn,
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

  @ManyToOne((type) => Board)
  @JoinColumn({ name: 'board_id' })
  @ApiProperty({ type: Board })
  board: Board;

  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.scraps)
  user: UserActivity;
}
