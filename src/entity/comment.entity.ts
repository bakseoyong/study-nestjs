import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
@Unique(['id'])
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: 'board Id' })
  boardId: number;

  @Column({ type: 'varchar', comment: 'commenter' })
  commenter: string;

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
