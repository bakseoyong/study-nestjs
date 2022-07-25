import { HashtagService } from 'src/hashtag/hashtag.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { BoardService } from './board.service';
import { Redis, RedisModule } from '@nestjs-modules/ioredis';
import { Board } from 'src/entity/board.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

const mockRepository = () => ({
  getById: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

const mockUserService = () => ({
  getFollowers: jest.fn(),
  getActivityBoardById: jest.fn(),
  getActivityById: jest.fn(),
});

const mockHashtagService = () => ({
  createBoardHashtags: jest.fn(),
});

const mockNotificationService = () => ({
  createNoti: jest.fn(),
});

describe('게시글 서비스', () => {
  let service: BoardService;
  let redis: Redis;

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [
        BoardService,
        { provide: getRepositoryToken(Board), useValue: mockRepository() },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: HashtagService, useValue: mockHashtagService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = modules.get<BoardService>(BoardService);

    // boardConroller = new BoardController(boardService);
    // boardService = new BoardService(
    //   jest.fn().mockReturnValue({
    //     getById: jest.fn().mockReturnValue({ id: 'test' }),
    //   } as unknown as BoardRepository)(),

    //   jest.fn().mockReturnValue({
    //     getFollowers: jest.fn().mockReturnValue({ success: true }),
    //   } as unknown as UserService)(),

    //   jest.fn().mockReturnValue({
    //     findOrCreateHahstags: jest.fn().mockReturnValue({ success: true }),
    //   } as unknown as HashtagService)(),

    //   jest.fn().mockReturnValue({
    //     createNoti: jest.fn().mockReturnValue({ success: true }),
    //   } as unknown as NotificationService)(),

    //   redis,
    // );
  });

  describe('게시판 생성', () => {
    it('', async () => {
      // const createBoardDto: CreateBoardDto = {
      //   title: 'test-title-1',
      //   content: 'test-content-1',
      //   tagNames: ['test', 'tag', '1'],
      // };
      // const req = {
      //   user: {
      //     uid: 'test-account-1',
      //   },
      // };
      // const result: BoardDto = {
      //   id: 1,
      //   user: { id: 'test-user-1' },
      //   titile: 'test-title-1',
      //   content: 'test-content-1',
      //   created: new Date(),
      //   updated: new Date(),
      //   deleted: new Date(),
      // };
      // jest
      //   .spyOn(boardService, 'createBoard')
      //   .mockImplementation((createBoardDto, req) => {});
      // expect(await boardConroller.createBoard(createBoardDto, req)).toBe(
      //   result,
      // );
    });
  });
});
