import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { Recommend } from 'src/entity/recommend.entity';

@EntityRepository(Recommend) //@EntityRepository deprecated in typeorm@^0.3.6
export class RecommendRepository extends Repository<Recommend> {
  async createRecommend(
    @TransactionManager() transactionManager: EntityManager,
    boardId: number,
    recommender: string,
  ): Promise<boolean> {
    Logger.log(`${boardId}, ${recommender}`);
    try {
      const recommend = await transactionManager.save(Recommend, {
        boardId,
        recommender,
      });
      return recommend ? true : false;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
          //error: error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
