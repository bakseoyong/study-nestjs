import { UserService } from 'src/user/user.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { Department, Role } from 'src/entity/user-profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';

//keyof는 존재하는 모든 키 값을 가져온다.
//Repository를 집어 넣으면 리포지토리의 키들을 가져온다. 키들의 값은 jest.Mock
// Partial을 통해 일부분만 구현할 수 있다.
type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

const mockRepository = () => ({
  save: jest.fn(),
  getById: jest.fn(),
  deleteUser: jest.fn(),
  readAllUser: jest.fn(),
  findByLogin: jest.fn(),
  findOne: jest.fn(),
});

describe('유저 서비스', () => {
  let service: UserService;
  let userRepository: MockRepository<UserRepository>;
  let userProfileRepository: MockRepository<UserProfileRepository>;
  let userActivityRepository: MockRepository<UserActivityRepository>;

  //구글링 하면 엔티티를 getRepositoryToken안에 집어 넣어야 되는데 이렇게 해야 동작됨
  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserRepository);
  const ACTIVITY_REPOSITORY_TOKEN = getRepositoryToken(UserActivityRepository);
  const PROFILE_REPOSITORY_TOKEN = getRepositoryToken(UserProfileRepository);

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockRepository(),
        },
        {
          provide: ACTIVITY_REPOSITORY_TOKEN,
          useValue: mockRepository(),
        },
        {
          provide: PROFILE_REPOSITORY_TOKEN,
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = modules.get<UserService>(UserService);

    userRepository = modules.get(USER_REPOSITORY_TOKEN);
    userActivityRepository = modules.get(ACTIVITY_REPOSITORY_TOKEN);
    userProfileRepository = modules.get(PROFILE_REPOSITORY_TOKEN);
  });

  beforeEach(async () => {
    userRepository.getById.mockResolvedValue({
      id: 1,
      uid: 'abc',
      role: Role.MEMBER,
      department: Department.컴퓨터공학과,
    });
    userRepository.deleteUser.mockResolvedValue(1);
    userRepository.save.mockResolvedValue(1);
    userProfileRepository.save.mockResolvedValue(1);
    userProfileRepository.readAllUser.mockResolvedValue(1);
    userProfileRepository.findByLogin.mockResolvedValue(1);
    userProfileRepository.findOne.mockResolvedValue(undefined);
    userActivityRepository.getById.mockResolvedValue(1);
    userActivityRepository.save.mockResolvedValue(1);
  });

  it('서비스 정의', () => {
    expect(service).toBeDefined();
  });

  it('유저 리포지토리 정의', () => {
    expect(userRepository).toBeDefined();
  });

  describe('유저 생성', () => {
    it('성공 : 유저 생성 성공', async () => {
      await service.createUser({
        uid: 'userTest1',
        email: 'userTestEmail@email.com',
        password: 'usetTestPassword!',
        phone: '010-0101-0101',
      });
    });
  });

  describe('유저 업데이트', () => {
    // it('성공 : 유저 업데이트 성공', async () => {
    //   jest.spyOn(userProfileRepository, 'save').mockResolvedValue(new User());

    //   const updateUserProfileDto: UpdateUserProfileDto = {
    //     id: '1',
    //     email: 'userTestEmail@email.com',
    //     password: 'usetTestPassword!',
    //     phone: '010-0101-0101',
    //   };

    //   // const result = async () => {
    //   //   await service.updateUserProfile(updateUserProfileDto);
    //   // };

    //   //await expect(result).resolves.toMatchObject(User);
    //   // await expect(result).toMatchObject(User);
    //   expect(service.updateUserProfile(updateUserProfileDto)).toMatchObject(
    //     User,
    //   );
    // });

    it('실패 : 유저 업데이트 실패', async () => {
      jest.spyOn(userProfileRepository, 'save').mockResolvedValue(undefined);

      const updateUserProfileDto: UpdateUserProfileDto = {
        id: '1',
        email: 'userTestEmail@email.com',
        password: 'usetTestPassword!',
        phone: '010-0101-0101',
      };

      const result = async () => {
        await service.updateUserProfile(updateUserProfileDto);
      };

      await expect(result).rejects.toThrowError(
        new NotFoundException('유저 정보를 찾을 수 없습니다.'),
      );
    });
  });
});
