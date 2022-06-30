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

@Entity({ name: 'boards' })
@Unique(['id'])
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: 'author' })
  author: string;

  @Column({ type: 'integer', comment: 'likes' })
  likes: number;

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
}
