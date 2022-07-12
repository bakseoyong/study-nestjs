import { Logger } from '@nestjs/common';
import { Follow } from 'src/entity/follow.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Follow) //@EntityRepository deprecated in typeorm@^0.3.6
export class FollowRepository extends Repository<Follow> {
  // async follow(from: User, to: User): Promise<boolean> {
  //   try {
  //     await this.save({ from: from, to: to });
  //     return true;
  //   } catch (error) {
  //     Logger.log(error);
  //   }
  // }
  // async unfollow(from: User, to: User): Promise<boolean> {
  //   try {
  //     if ((await this.delete({ from: from, to: to })).affected === 0) {
  //       return false;
  //     }
  //     return true;
  //   } catch (error) {
  //     Logger.log(error);
  //   }
  // }
}
