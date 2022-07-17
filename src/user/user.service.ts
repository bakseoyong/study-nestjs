import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';
import { UserProfile } from 'src/entity/user-profile.entity';
import { User } from 'src/entity/user.entity';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { FollowersDto } from './dto/followers.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserActivityDto } from './dto/user-activity.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) // private userRepository: UserRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userActivityRepository: UserActivityRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const userProfile = await this.userProfileRepository.createUser(
      createUserDto,
    );

    const user = new User();
    user.id = userProfile.id;

    const userActivity = new UserActivity();
    userActivity.id = userProfile.id;

    await this.userRepository.save(user);
    await this.userActivityRepository.save(userActivity);

    return true;
  }

  updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<boolean> {
    return this.userProfileRepository.updateUserProfile(updateUserProfileDto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }

  readAllUser(): Promise<UserProfile[]> {
    return this.userProfileRepository.readAllUser();
  }

  getById(userId: string): Promise<User> {
    return this.userRepository.getById(userId);
  }

  getActivityById(userId: string): Promise<UserActivityDto> {
    return this.userActivityRepository.getById(userId);
  }

  getFollowers(userId: string): Promise<FollowersDto> {
    return this.userActivityRepository.getFollowers(userId);
  }
}
