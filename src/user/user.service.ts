import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entity/room.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { UserProfile } from 'src/entity/user-profile.entity';
import { User } from 'src/entity/user.entity';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';
import { ChatRoomsDto } from './dto/chat-rooms.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { FollowersDto } from './dto/followers.dto';
import { NotificationsDto } from './dto/notificatinos-dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserActivityBoardDto } from './dto/user-activity-board.dto';
import { UserActivityDto } from './dto/user-activity.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { WrittenBoardsDto } from './dto/written-board.dto';

@Injectable()
export class UserService {
  constructor(
    //custom repository는 @InjectRepository 데코레이터를 사용하지 않는다.
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userActivityRepository: UserActivityRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const userProfile = await this.userProfileRepository.createUser(
      createUserDto,
    );

    const user = new User();
    user.id = userProfile.id;

    const userActivity = new UserActivity();
    userActivity.id = userProfile.id;

    await this.userRepository.save(user);
    await this.userActivityRepository.save(userActivity);

    return userProfile;
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

  getActivityBoardById(userId: string): Promise<UserActivityBoardDto> {
    return this.userActivityRepository.getById(userId);
  }

  getFollowers(userId: string): Promise<FollowersDto> {
    return this.userActivityRepository.getById(userId);
  }

  getChatRooms(userId: string): Promise<ChatRoomsDto> {
    return this.userActivityRepository.getById(userId);
  }

  async addChatRooms(
    userId: string,
    partner: string,
    roomId: number,
  ): Promise<boolean> {
    const user: UserActivity = await this.userActivityRepository.getById(
      userId,
    );
    const chatRoom = Room.from(roomId, partner);
    user.chatRooms.push(chatRoom);
    user.save();
    return true;
  }

  getBoards(userId: string): Promise<WrittenBoardsDto> {
    return this.userActivityRepository.getById(userId);
  }

  getNotifications(userId: string): Promise<NotificationsDto> {
    return this.userActivityRepository.getById(userId);
  }
}
