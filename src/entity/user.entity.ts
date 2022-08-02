import { BaseEntity, Entity, OneToOne, PrimaryColumn, Unique } from 'typeorm';
import { UserActivity } from './user-activity.entity';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  userProfile: UserProfile;

  @OneToOne(() => UserActivity, (userActivity) => userActivity.user)
  userActivity: UserActivity;

  create(userId: string): User {
    const user = new User();
    user.id = userId;
    return user;
  }
}
