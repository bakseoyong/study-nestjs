import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { Room } from 'src/entity/room.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { Role, UserProfile } from 'src/entity/user-profile.entity';
import { User } from 'src/entity/user.entity';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
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
    const userProfile = new UserProfile();
    userProfile.create(createUserDto);
    await this.userProfileRepository.save(userProfile);

    const user = new User();
    user.create(userProfile.getId());
    await this.userRepository.save(user);

    const userActivity = new UserActivity();
    userActivity.create(userProfile.getId());
    await this.userActivityRepository.save(userActivity);

    return userProfile;
  }

  async update(
    updateUserProfileDto: UpdateUserProfileDto,
    jwtPayload: { id: string; role: Role },
  ): Promise<UserProfileDto> {
    const { id } = updateUserProfileDto;

    this.checkUpdatable(id, jwtPayload);

    const user = await this.userProfileRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
    }

    user.update(updateUserProfileDto);
    return this.userProfileRepository.save(user);
  }

  async deleteUser(
    id: string,
    jwtPayload: { id: string; role: Role },
  ): Promise<boolean> {
    this.checkUpdatable(id, jwtPayload);
    return this.userRepository.deleteUser(id);
  }

  readAllUser(jwtPayload: { id: string; role: Role }): Promise<UserProfile[]> {
    this.onlyAccessableAdmin(jwtPayload);
    return this.userProfileRepository.readAllUser();
  }

  getActivityById(userId: string): Promise<UserActivityDto> {
    return this.userActivityRepository.findOne(userId);
  }

  getActivityBoardById(userId: string): Promise<UserActivityBoardDto> {
    return this.userActivityRepository.findOne(userId);
  }

  async addChatRooms(
    userId: string,
    partner: string,
    roomId: number,
  ): Promise<boolean> {
    const user: UserActivity = await this.userActivityRepository.findOne(
      userId,
    );
    const chatRoom = Room.from(roomId, partner);
    user.addChatRoom(chatRoom);
    this.userActivityRepository.save(user);
    return true;
  }

  async getBoards(userId: string): Promise<WrittenBoardsDto> {
    const user: UserActivity = await this.userActivityRepository.findOne(
      userId,
    );

    const writtenBoardsDto = new WrittenBoardsDto();
    writtenBoardsDto.boards = user.getBoards();
    return writtenBoardsDto;
  }

  private checkUpdatable(
    userId: string,
    jwtPayload: { id: string; role: Role },
  ): void {
    if (jwtPayload.role !== Role.ADMIN) {
      throw new BadRequestException();
    }
    if (jwtPayload.id !== userId) {
      throw new BadRequestException(
        `user(${jwtPayload.id}) Cannot update other user`,
      );
    }
  }

  private onlyAccessableAdmin(jwtPayload: { id: string; role: Role }) {
    if (jwtPayload.role != Role.ADMIN) {
      throw new BadRequestException();
    }
  }
}
