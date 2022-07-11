import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'follows' })
@Unique(['id'])
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //나를 팔로우 하는 사람
  @ManyToOne((type) => User, (user) => user.followers)
  to: User;

  //내가 팔로우 하는 사람
  @ManyToOne((type) => User, (user) => user.followings)
  from: User;
}
