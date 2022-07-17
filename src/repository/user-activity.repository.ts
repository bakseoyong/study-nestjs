import { EntityRepository, Repository } from 'typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import { FollowersDto } from 'src/user/dto/followers.dto';

@EntityRepository(UserActivity) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserActivityRepository extends Repository<UserActivity> {
  async getById(userId: string): Promise<UserActivityDto> {
    return await this.getById(userId);
  }

  async findById(userId: string): Promise<UserActivity> {
    return this.findById(userId);
  }

  async getFollowers(userId: string): Promise<FollowersDto> {
    return this.findById(userId);
  }
}
