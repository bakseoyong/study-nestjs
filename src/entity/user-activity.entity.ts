import { ApiProperty } from '@nestjs/swagger';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import {
  Entity,
  Unique,
  BaseEntity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './comment.entity';
import { Follow } from './follow.entity';
import { Notification } from './notification.entity';
import { Scrap } from './scrap.entity';
import { User } from './user.entity';

@Entity({ name: 'user_activities' })
@Unique(['user'])
export class UserActivity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ApiProperty({})
  @OneToOne(() => User, (user) => user.userProfile, { cascade: true })
  @JoinColumn()
  user: User;

  @ApiProperty({})
  @OneToMany((type) => Follow, (follow) => follow.to)
  followings: Follow[];

  @ApiProperty({})
  @OneToMany((type) => Follow, (follow) => follow.from)
  followers: Follow[];

  @ApiProperty({})
  @ManyToOne((type) => Scrap, (scrap) => scrap.user)
  scraps: Scrap[];

  @ApiProperty({})
  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];

  @ApiProperty({})
  @OneToMany((type) => Notification, (notification) => notification.to)
  notifications: Notification[];

  @ApiProperty({})
  @OneToMany((type) => Board, (board) => board.user)
  boards: Board[];

  @ApiProperty({})
  chatRooms: number[];

  static from(userActivityDto: UserActivityDto): UserActivity {
    const userActivity = new UserActivity();
    userActivity.id = userActivityDto.id;
    return userActivity;
  }

  static to(userActivity: UserActivity): UserActivityDto {
    const userActivityDto = new UserActivityDto();
    userActivityDto.id = userActivity.id;
    return userActivityDto;
  }
}
