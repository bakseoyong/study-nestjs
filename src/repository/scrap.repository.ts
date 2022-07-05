import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ScrapBoardDto } from 'src/board/dto/scrap-board.dto';
import { Board } from 'src/entity/board.entity';
import { Scrap } from 'src/entity/scrap.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';

@EntityRepository(Scrap) //@EntityRepository deprecated in typeorm@^0.3.6
export class ScrapRepository extends Repository<Scrap> {
  async createScrap(
    @TransactionManager() transactionManager: EntityManager,
    scrapBoardDto: ScrapBoardDto,
  ): Promise<Scrap> {
    try {
      const { boardId, userId } = scrapBoardDto;
      const scrap = await this.save({ boardId, userId });
      return scrap;
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

  async findScrapsByUserId(userId: string): Promise<any> {
    try {
      const boards = await getConnection()
        .createQueryBuilder()
        .select([])
        .from(Board, 'boards')
        .from(Scrap, 'scraps')
        // Not where !
        .having('cursorr < :cursorr', { cursorr: cursor })
        .orderBy('likes', 'DESC')
        .orderBy('id', 'DESC')
        .take(paginationBoardDto.limit);

      return await boards.execute();
      // const scraps = await this.find({
      //   where: { userId: userId },
      //   relations: ['board'],
      // });

      // return scraps;
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
