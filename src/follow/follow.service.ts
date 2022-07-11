import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { FollowRepository } from 'src/repository/follow.repository';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  follow(from: User, to: User): Promise<boolean> {
    return this.followRepository.follow(from, to);
  }

  unfollow(from: User, to: User): Promise<boolean> {
    return this.followRepository.unfollow(from, to);
  }
}
