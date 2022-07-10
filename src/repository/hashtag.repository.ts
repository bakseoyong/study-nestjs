import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Hashtag } from 'src/entity/hashtag.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';

@EntityRepository(Hashtag) //@EntityRepository deprecated in typeorm@^0.3.6
export class HashtagRepository extends Repository<Hashtag> {
  async findByTagName(tagName: string): Promise<Hashtag> {
    try {
      const hashtag = await this.findOne({ where: { tagName: tagName } });
      return hashtag;
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

  async createTag(tagName: string): Promise<Hashtag> {
    try {
      const hashtag = await this.save({ tagName: tagName });
      return hashtag;
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
