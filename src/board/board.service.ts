import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardRepository } from 'src/repository/board.repository';
import { CommentRepository } from 'src/repository/comment.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { getConnection } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InitViewDto } from './dto/init-view.dto';
import { PaginationBoardDto, SortType } from './dto/pagination-boards.dto';
import { ScrapBoardDto } from './dto/scrap-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly recommendRepository: RecommendRepository,
    private readonly reportRepository: ReportRepository,
    private readonly commentRepository: CommentRepository,
    private readonly scrapRepository: ScrapRepository,
  ) {}

  async getBoardById(id: number): Promise<InitViewDto> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const board = await this.boardRepository.getBoardById(
        queryRunner.manager,
        id,
      );

      const comments = await this.commentRepository.getOldest20Comments(
        queryRunner.manager,
        id,
      );

      const initViewDto: InitViewDto = { board: board, comments: comments };

      await queryRunner.commitTransaction();

      return initViewDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.log(error);
    }
  }

  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
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
      this.recommendRepository.createRecommend(
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
      Logger.log(error);
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
    return this.boardRepository.getPopularBoards();
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.commentRepository.createComment(
        queryRunner.manager,
        createCommentDto,
      );
      const result = await this.boardRepository.createComment(
        queryRunner.manager,
        createCommentDto.boardId,
      );

      queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.log(error);
    }
  }

  async scrapBoard(scrapBoardDto: ScrapBoardDto): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      //scrap에 board넣기
      const scrap = await this.scrapRepository.createScrap(
        queryRunner.manager,
        scrapBoardDto,
      );
      const result = await this.boardRepository.createScrap(
        queryRunner.manager,
        scrapBoardDto.boardId,
        scrap,
      );

      queryRunner.commitTransaction();

      return result ? true : false;
    } catch (error) {
      queryRunner.rollbackTransaction();
    }
  }

  async getScrapBoardsFindByUserId(userId: string): Promise<any> {
    // const queryRunner = await getConnection().createQueryRunner();
    // await queryRunner.startTransaction();

    // try {
    return this.scrapRepository.findScrapsByUserId(userId);
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   Logger.log(error);
    // }
  }
}
