import { UserService } from 'src/user/user.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Connection, Repository } from 'typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';
import { UserProfile } from 'src/entity/user-profile.entity';
import { UserRepository } from 'src/repository/user.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';

//keyof는 존재하는 모든 키 값을 가져온다.
//Repository를 집어 넣으면 리포지토리의 키들을 가져온다. 키들의 값은 jest.Mock
//Partial을 통해 일부분만 구현할 수 있다.
// type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

// const mockRepository = () => ({
//   createUser: jest.fn(),
//   deleteUser: jest.fn(),
//   updateUserProfile: jest.fn(),
//   readAllUser: jest.fn(),
//   findByLogin: jest.fn(),
// });

describe('유저 서비스', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let userProfileRepository: Repository<UserProfile>;
  let userActivityRepository: Repository<UserActivity>;

  //구글링 하면 엔티티를 getRepositoryToken안에 집어 넣어야 되는데 이렇게 해야 동작됨
  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserRepository);
  const ACTIVITY_REPOSITORY_TOKEN = getRepositoryToken(UserRepository);
  const PROFILE_REPOSITORY_TOKEN = getRepositoryToken(UserProfileRepository);

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      providers: [
        UserService,
        {
          //provied에 USER_REPOSITORY_TOKEN을 넣으면 에러.
          //서비스 계층에서 private readonly로 설정한 경우 리포지토리 이름과 같게 입력하라고 함.
          provide: UserRepository,
          useValue: { getById: jest.fn(), deleteUser: jest.fn() },
        },
        {
          provide: UserActivityRepository,
          useValue: { getById: jest.fn() },
        },
        {
          provide: UserProfileRepository,
          useValue: {
            createUser: jest.fn(),
            updateUserProfile: jest.fn(),
            readAllUser: jest.fn(),
            findByLogin: jest.fn(),
          },
        },
        Connection,
        { provide: Connection, useClass: class MockConnection {} },
      ],
    }).compile();

    service = modules.get<UserService>(UserService);

    userRepository = modules.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    userActivityRepository = modules.get<Repository<UserActivity>>(
      ACTIVITY_REPOSITORY_TOKEN,
    );
    userProfileRepository = modules.get<Repository<UserProfile>>(
      PROFILE_REPOSITORY_TOKEN,
    );
  });

  it('서비스 정의', () => {
    expect(service).toBeDefined();
  });

  it('유저 리포지토리 정의', () => {
    expect(userRepository).toBeDefined();
  });

  describe('유저 생성', () => {
    it('유저 생성 성공', async () => {
      await service.createUser({
        uid: 'userTest1',
        email: 'userTestEmail@email.com',
        password: 'usetTestPassword!',
        phone: '010-0101-0101',
      });
    });
  });
});
