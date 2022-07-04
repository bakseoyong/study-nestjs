import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ScrapBoardDto } from 'src/board/dto/scrap-board.dto';
import { Scrap } from 'src/entity/scrap.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Scrap) //@EntityRepository deprecated in typeorm@^0.3.6
export class ScrapRepository extends Repository<Scrap> {
  async createScrap(scrapBoardDto: ScrapBoardDto): Promise<boolean> {
    try {
      const { boardId, userId } = scrapBoardDto;
      const scrap = await this.save({ boardId, userId });
      return scrap ? true : false;
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
