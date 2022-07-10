import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BoardHashtag } from 'src/entity/board-hashtag.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';

@EntityRepository(BoardHashtag) //@EntityRepository deprecated in typeorm@^0.3.6
export class BoardHashtagRepository extends Repository<BoardHashtag> {
  async createBoardHashtag(body): Promise<boolean> {
    try {
      for (const hashtag of body.hashtags) {
        body.board.hashtags.push(hashtag);
      }
      await this.save(body.board);
      return true;
    } catch (error) {
      Logger.log(error);
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
