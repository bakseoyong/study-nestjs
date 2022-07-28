import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Scrap } from 'src/entity/scrap.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';

@EntityRepository(Scrap) //@EntityRepository deprecated in typeorm@^0.3.6
export class ScrapRepository extends Repository<Scrap> {
  async findScrapsByUserId(userId: string): Promise<any> {
    try {
      const scraps = await this.find({
        where: { userId: userId },
        relations: ['board'],
      });

      return scraps;
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
