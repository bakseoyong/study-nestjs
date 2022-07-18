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
import { Hashtag } from './hashtag.entity';

@Entity({ name: 'board_hashtag' })
@Unique(['id'])
export class BoardHashtag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '1',
    description: '게시글 번호',
    type: Board,
  })
  @ManyToOne((type) => Board, (board) => board.boardHashtag)
  @JoinColumn()
  aaa: Board;

  @ApiProperty({
    example: '#테스트',
    description: '해시태그',
  })
  @ManyToOne((type) => Hashtag, (hashtag) => hashtag.boardHashtag)
  @JoinColumn()
  hashtag: Hashtag;
}
