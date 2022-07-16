import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UpdateUserProfileDto } from 'src/user/dto/update-user-profile.dto';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/entity/user-profile.entity';

@EntityRepository(UserProfile) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserProfileRepository extends Repository<UserProfile> {
  async createUser(createUserDto: CreateUserDto): Promise<UserProfile> {
    try {
      const { uid, email, phone } = createUserDto;
      const password = await bcrypt.hash(createUserDto.password, 10);

      const userProfile = await this.save({
        uid,
        password,
        email,
        phone,
      });

      return userProfile;
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

  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<boolean> {
    try {
      const { uid, email, phone } = updateUserProfileDto;
      const password = await bcrypt.hash(updateUserProfileDto.password, 10);

      const userProfile = await this.update(
        { uid },
        {
          password,
          email,
          phone,
        },
      );

      return userProfile ? true : false;
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
