import { Redis, RedisModule } from '@nestjs-modules/ioredis';
import { Test } from '@nestjs/testing';

describe('광고 리포지토리 테스트', () => {
  let redis: Redis;

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();
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
