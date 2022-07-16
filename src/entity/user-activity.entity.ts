import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Unique,
  BaseEntity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Follow } from './follow.entity';
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
}
