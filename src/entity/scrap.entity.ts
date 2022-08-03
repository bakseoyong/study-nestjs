import { HttpException } from '@nestjs/common';
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

  @ApiProperty({ type: Board })
  @ManyToOne((type) => Board)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.scraps)
  user: UserActivity;

  create(userActivity: UserActivity, board: Board): Scrap {
    const scrap = new Scrap();
    scrap.board = board;
    scrap.user = userActivity;
    return scrap;
  }
}
