import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Scrap } from './scrap.entity';

@Entity({ name: 'boards' })
@Unique(['id'])
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: 'author' })
  author: string;

  @Column({ type: 'integer', default: 0, comment: 'likes' })
  likes: number;

  @Column({ type: 'integer', default: 0, comment: 'num of comments' })
  comments: number;

  @Column({ type: 'integer', comment: 'num of scraps' })
  scraps: number;

  @Column({ type: 'varchar', comment: 'Title' })
  title: string;

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
  scrap: Scrap[];
}
