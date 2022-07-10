import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BoardHashtag } from './board-hashtag.entity';

@Entity({ name: 'hashtags' })
@Unique(['id'])
export class Hashtag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: 'hashtag keyword' })
  keyword: string;

  @OneToMany((type) => BoardHashtag, (boardHashtag) => boardHashtag.hashtag)
  boardHashtag: BoardHashtag;
}
