import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;
}
