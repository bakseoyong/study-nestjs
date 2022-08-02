import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/entity/user-profile.entity';

@EntityRepository(UserProfile) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserProfileRepository extends Repository<UserProfile> {
  async readAllUser(): Promise<UserProfile[]> {
    return await this.find();
  }

  async findByLogin(uid: string, password: string): Promise<UserProfile> {
    try {
      const user = await this.findOne({ where: { uid } });

      if (!user) {
        throw new ForbiddenException('incorrect ID');
      }

      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new UnauthorizedException('incorrect Password');
      }
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
