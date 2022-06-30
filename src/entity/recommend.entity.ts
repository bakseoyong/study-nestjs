import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'recommends' })
@Unique(['id'])
export class Recommend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: 'recommended board id' })
  boardId: number;

  @Column({ type: 'varchar', unique: true, comment: 'recommender' })
  recommender: string;
}
