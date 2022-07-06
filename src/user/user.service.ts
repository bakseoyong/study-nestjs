import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) // private userRepository: UserRepository,
    private userRepository: UserRepository,
  ) {}

  createUser(createUserDto: CreateUserDto): Promise<boolean> {
    return this.userRepository.createUser(createUserDto);
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<boolean> {
    return this.userRepository.updateUser(updateUserDto);
  }

  deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }

  readAllUser(): Promise<User[]> {
    return this.userRepository.readAllUser();
  }

  followUser(followId: string, follower: string): Promise<boolean> {
    return this.userRepository.followUser(followId, follower);
  }

  unfollowUser(followId: string, follower: string): Promise<boolean> {
    return this.userRepository.unfollowUser(followId, follower);
  }

  getFollowers(userId: string): Promise<User[]> {
    return this.userRepository.getFollowers(userId);
  }
}
