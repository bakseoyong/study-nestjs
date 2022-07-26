import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserActivity } from './user-activity.entity';

@Entity({ name: 'follows' })
@Unique(['id'])
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 나를 팔로우 하는 사람
  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.followers)
  to: UserActivity;

  //내가 팔로우 하는 사람
  @ManyToOne((type) => UserActivity, (userActivity) => userActivity.followings)
  from: UserActivity;
}
