import { Injectable } from '@nestjs/common';
import { UserActivity } from 'src/entity/user-activity.entity';
import { FollowRepository } from 'src/repository/follow.repository';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async getFollowersByUserId(userId: string): Promise<UserActivity[]> {
    const follows = await this.followRepository.getFollowersByUserId(userId);

    const followers = follows.map((follow) => follow.from);
    return followers;
  }
  // follow(from: User, to: User): Promise<boolean> {
  //   return this.followRepository.follow(from, to);
  // }

  // unfollow(from: User, to: User): Promise<boolean> {
  //   return this.followRepository.unfollow(from, to);
  // }
}
