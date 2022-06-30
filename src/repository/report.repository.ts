import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { Report } from 'src/entity/report.entity';

@EntityRepository(Report) //@EntityRepository deprecated in typeorm@^0.3.6
export class ReportRepository extends Repository<Report> {
  async createReport(boardId: number, reporter: string): Promise<boolean> {
    try {
      const report = await this.save({ boardId, reporter });
      return report ? true : false;
    } catch (error) {
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // async isMoreThan5Reports(
  //   boardId: number,
  //   success: boolean,
  // ): Promise<ReportQueryResultDto> {
  //   try {
  //     const reports = await this.count({
  //       where: { id: boardId },
  //     });

  //     Logger.log(`queryResult is : ${reports}`);
  //     if (reports >= 5) return { success: success, restricted: true };
  //     else return { success: success, restricted: false };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         message: 'SQL Error',
  //         error: error.sqlMessage,
  //       },
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }
}
