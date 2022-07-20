import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BoardHashtag } from './board-hashtag.entity';
import { Comment } from './comment.entity';
import { BoardDto } from './dto/board.dto';
import { Scrap } from './scrap.entity';
import { UserActivity } from './user-activity.entity';

@Entity({ name: 'boards' })
@Unique(['id'])
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional()
  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.user)
  user: UserActivity;

  @Column({ type: 'integer', default: 0, comment: 'view count' })
  viewCount: number;

  @Column({ type: 'integer', default: 0, comment: 'likes' })
  likes: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Column({ type: 'varchar', comment: 'Title' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @Column({ type: 'varchar', comment: 'Content' })
  content: string;

  @CreateDateColumn({ name: 'created', comment: 'Created Date' })
  created: Date;

  @UpdateDateColumn({ name: 'updated', comment: 'Updated Date' })
  updated: Date;

  @DeleteDateColumn({ name: 'deleted', comment: 'Deleted Date' })
  deleted: Date;

  // '/board/my-scrap-board' JOIN
  @OneToMany((type) => Scrap, (scrap) => scrap.board)
  @ApiProperty({ type: () => Scrap })
  scraps: Scrap[];

  @OneToMany((type) => BoardHashtag, (boardHashtag) => boardHashtag.board)
  @ApiProperty({ type: () => BoardHashtag })
  boardHashtag: BoardHashtag[];

  @OneToMany((type) => Comment, (comment) => comment.board)
  @ApiProperty({ type: () => Comment })
  comments: Comment[];

  static from(boardDto: BoardDto) {
    const board = new Board();
    board.id = boardDto.id;
    board.user = boardDto.user;
    board.likes = boardDto.likes;
    board.title = boardDto.title;
    board.content = boardDto.content;
    board.created = boardDto.created;
    board.updated = boardDto.updated;
    board.deleted = boardDto.deleted;
    return board;
  }
}
