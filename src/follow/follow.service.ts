import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { FollowRepository } from 'src/repository/follow.repository';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async getFollowersByUserId(userId: string): Promise<User[]> {
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
