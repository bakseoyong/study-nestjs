import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'reports' })
@Unique(['id'])
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: 'recommended board id' })
  boardId: number;

  @Column({ type: 'varchar', unique: true, comment: 'recommender' })
  reporter: string;
}
