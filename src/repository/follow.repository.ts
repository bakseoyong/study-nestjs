import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Follow } from 'src/entity/follow.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Follow) //@EntityRepository deprecated in typeorm@^0.3.6
export class FollowRepository extends Repository<Follow> {
  async getFollowersByUserId(userId: string): Promise<Follow[]> {
    // 유저가 들어가야되는데...
    // 1. 여기서 유저 객체 생성해서 팔로워객체들 불러오기
    // 2. 팔로우 객체를 문자열로 바꾸고 팔로워 문자열들 불러와서 전부 객체화 시키기
    // 3. manyToOne 관계에서 외래키가 유저 id일텐데 이걸로 할 수 있지 않을까...
    //oneToMany 에서 find쓰는법 알아오기
    try {
      const follows: Follow[] = await this.createQueryBuilder('userActivity')
        .innerJoinAndSelect('userActivity.followings', 'followings')
        .where('user_id = :userId', { userId: userId })
        .getMany();

      return follows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

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
