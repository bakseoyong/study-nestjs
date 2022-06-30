import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { BoardRepository } from 'src/repository/board.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { getConnection } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { PagenationBoardsDto } from './dto/pagenation-boards.dto';

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

  async loadPagenationBoards(
    pagenationBoardsDto: PagenationBoardsDto,
  ): Promise<Board[]> {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      if (pagenationBoardsDto.likes !== undefined) {
        //count랑 page는 같이가는거고, findcursor에서 리턴값이 추천수에 맞게 조정될것이고 load에서도 추천수에 맞게 정렬된다음에 갈것이다
        //같은 좋아요수가 나올 가능성이 크므로 도움을 받았던 게시물을 다시 한번 살펴보기
        const test = await this.boardRepository.findLikesCursor(
          pagenationBoardsDto,
        );
      }
      const cursor = await this.boardRepository.findCursor(pagenationBoardsDto);

      Logger.log(`loadPagenationBoards cursor is : ${cursor}`);
      const boards = await this.boardRepository.loadPagenationBoards(
        pagenationBoardsDto,
        cursor,
      );
      await queryRunner.commitTransaction();

      return boards;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
