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
import { Room } from './room.entity';
import { Scrap } from './scrap.entity';
import { User } from './user.entity';

@Entity({ name: 'user_activities' })
@Unique(['user'])
export class UserActivity {
  @PrimaryColumn()
  id: string;

  @ApiProperty({})
  @OneToOne(() => User, (user) => user.userProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({})
  @OneToMany((type) => Follow, (follow) => follow.to)
  @JoinColumn({ name: 'follow_id' })
  followings: Follow[];

  @ApiProperty({})
  @OneToMany((type) => Follow, (follow) => follow.from)
  @JoinColumn({ name: 'follow_id' })
  followers: Follow[];

  @ApiProperty({})
  @ManyToOne((type) => Scrap, (scrap) => scrap.user)
  @JoinColumn({ name: 'scrap_id' })
  scraps: Scrap[];

  @ApiProperty({})
  @OneToMany((type) => Comment, (comment) => comment.user)
  @JoinColumn({ name: 'comment_id' })
  comments: Comment[];

  @ApiProperty({})
  @OneToMany((type) => Notification, (notification) => notification.to)
  @JoinColumn({ name: 'notification_id' })
  notifications: Notification[];

  @ApiProperty({})
  @OneToMany((type) => Board, (board) => board.user)
  @JoinColumn({ name: 'board_id' })
  boards: Board[];

  @ApiProperty({})
  @JoinColumn({ name: 'room_id' })
  chatRooms: Room[];

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

  static async create(userId: string): Promise<UserActivity> {
    const activity = new UserActivity();
    activity.id = userId;
    return activity;
  }

  addChatRoom(room: Room) {
    this.chatRooms.push(room);
  }

  getFollowers(): Follow[] {
    return this.followers;
  }

  getChatRooms(): Room[] {
    return this.chatRooms;
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getScraps(): Scrap[] {
    return this.scraps;
  }

  getScrapOne(board: Board): Scrap {
    const scraps = this.getScraps();
    scraps.map((scrap) => {
      if (scrap.board === board) {
        return scrap;
      }
    });
    throw new Error('스크랩이 존재하지 않습니다.');
  }
}
