import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@EntityRepository(User) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const { id, email, phone } = createUserDto;
      const password = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.save({
        id,
        password,
        salt: '임시',
        email,
        phone,
      });

      return user ? true : false;
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      const { id, email, phone } = updateUserDto;
      const password = await bcrypt.hash(updateUserDto.password, 10);

      const user = await this.update(
        { id },
        {
          password,
          email,
          phone,
        },
      );

      return user ? true : false;
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

  async deleteUser(id: string): Promise<boolean> {
    try {
      const deleteUser = await this.delete(id);

      //deleteUser DeleteResult { raw : [], affected : 1 }
      if (deleteUser.affected === 0) {
        throw new NotFoundException('There is no user to delete');
      }

      return true;
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

  async readAllUser(): Promise<User[]> {
    return await this.find();
  }

  async findByLogin(id: string, password: string): Promise<User> {
    try {
      const user = await this.findOne({ where: { id } });

      if (!user) {
        throw new ForbiddenException('incorrect ID');
      }

      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new UnauthorizedException('incorrect Password');
      }
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

  async followUser(followId: string, follower: string): Promise<boolean> {
    const user1 = await this.findOne(followId, {
      relations: ['following'],
    });
    const user2 = await this.findOne(follower, {
      relations: ['follower'],
    });
    user1.following.push(user2);
    user2.follower.push(user1);
    await this.save(user1);
    await this.save(user2);

    return true;
  }

  async unfollowUser(followId: string, follower: string): Promise<boolean> {
    const user1 = await this.findOne(followId, {
      relations: ['following'],
    });
    const user2 = await this.findOne(follower, {
      relations: ['follower'],
    });
    delete user1[user1.following.findIndex((user) => user === user2)];
    delete user2[user2.follower.findIndex((user) => user === user1)];

    return true;
  }

  async getFollowers(userId: string): Promise<User[]> {
    try {
      const users = await this.find({
        relations: ['follower'],
        where: { no: userId },
      });

      return users;
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
}
