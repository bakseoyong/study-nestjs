import {
  BadRequestException,
  Injectable,
  Logger,
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

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const profile = await UserProfile.create(createUserDto);
    await this.userProfileRepository.save(profile);

    const user = await User.create(profile.getId());
    await this.userRepository.save(user);

    const activity = await UserActivity.create(profile.getId());

    activity.user = user;
    profile.user = user;
    await this.userProfileRepository.save(profile);
    await this.userActivityRepository.save(activity);

    return profile;
  }

  async update(
    updateUserProfileDto: UpdateUserProfileDto,
    jwtPayload: { id: string; role: Role },
  ): Promise<UserProfileDto> {
    const { id } = updateUserProfileDto;

    this.checkCRUDable(id, jwtPayload);

    const user = await this.userProfileRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
    }

    user.update(updateUserProfileDto);
    return this.userProfileRepository.save(user);
  }

  async delete(
    id: string,
    jwtPayload: { id: string; role: Role },
  ): Promise<boolean> {
    this.checkCRUDable(id, jwtPayload);
    const user = await this.userRepository.findOne(id);
    this.userRepository.remove(user);
    return true;
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

  //Get - 다른 서비스에서 호출, Read - API를 통한 호출
  async readProfile(
    id: string,
    user: { id: string; role: Role },
  ): Promise<UserProfileDto> {
    this.checkCRUDable(id, user);
    return this.userProfileRepository.findOne(id);
  }

  async readActivity(
    id: string,
    user: { id: string; role: Role },
  ): Promise<UserActivityDto> {
    this.checkCRUDable(id, user);
    return this.userActivityRepository.findOne(id);
  }

  private checkCRUDable(
    userId: string,
    jwtPayload: { id: string; role: Role },
  ): void {
    if (jwtPayload.role === Role.ADMIN || jwtPayload.id === userId) {
      return;
    }
    throw new BadRequestException();
  }

  private onlyAccessableAdmin(jwtPayload: { id: string; role: Role }) {
    if (jwtPayload.role != Role.ADMIN) {
      throw new BadRequestException();
    }
  }
}
