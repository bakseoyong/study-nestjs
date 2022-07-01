import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardRepository } from 'src/repository/board.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { getConnection } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly recommendRepository: RecommendRepository,
    private readonly reportRepository: ReportRepository,
  ) {}

  getBoardById(id: number): Promise<Board> {
    return this.boardRepository.getBoardById(id);
  }

  createBoard(createBoardDto: CreateBoardDto): Promise<boolean> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  setAuthorUndefined(userId: string): Promise<boolean> {
    return this.boardRepository.updateAuthorUndefined(userId);
  }

  findByUserId(userId: string): Promise<Board[]> {
    return this.boardRepository.findByUserId(userId);
  }

  async recommendBoard(id: number, recommender: string): Promise<number> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.recommendRepository.createRecommend(
        queryRunner.manager,
        id,
        recommender,
      );
      const likes = await this.boardRepository.recommendBoard(
        queryRunner.manager,
        id,
      );
      await queryRunner.commitTransaction();

      return likes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  findMoreThan10Likes(date: string): Promise<Board[]> {
    const stringToDate = new Date(date);
    const dateFormatter = (date) => date.toISOString().slice(0, 10);
    Logger.log(
      `findMoreThan10Likes Service Layer : ${dateFormatter(stringToDate)}`,
    );
    return this.boardRepository.findMoreThan10Likes(
      dateFormatter(stringToDate),
    );
  }

  reportBoard(id: number, reporter: string): Promise<boolean> {
    return this.reportRepository.createReport(id, reporter);
  }

  // findMoreThan5Reports(): Promise<Board[]> {
  //   return this.boardRepository.findMoreThan5Reports(dateFormatter());
  // }

  getBoardsUsingCursor(
    paginationBoardsDto: PaginationBoardDto,
  ): Promise<Board[]> {
    switch (paginationBoardsDto.type) {
      case SortType.LIKES: {
        return this.boardRepository.getSortedLikesBoards(paginationBoardsDto);
      }
      case SortType.NEWLY: {
        return this.boardRepository.getSortedNewlyBoards(paginationBoardsDto);
      }
    }
  }

  getPopularBoards(): Promise<Board[]> {
    //const date = new Date().;

    return this.boardRepository.getPopularBoards();
  }
}
