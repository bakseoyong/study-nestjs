import {
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import {
  EntityManager,
  EntityRepository,
  getConnection,
  IsNull,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Repository,
  TransactionManager,
} from 'typeorm';
import { PagenationBoardsDto } from 'src/board/dto/pagenation-boards.dto';
import { buildPaginator } from 'typeorm-cursor-pagination';

@EntityRepository(Board) //@EntityRepository deprecated in typeorm@^0.3.6
export class BoardRepository extends Repository<Board> {
  async getBoardById(id: number): Promise<Board> {
    try {
      const board = await this.findOne({ where: { id: id } });

      if (!board) {
        throw new NotFoundException('The post does not exist');
      }

      return board;
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

  async createBoard(createBoardDto: CreateBoardDto): Promise<boolean> {
    try {
      const board = await this.insert(createBoardDto);

      return board ? true : false;
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

  async updateAuthorUndefined(userId: string): Promise<boolean> {
    try {
      const author = null;
      const deleteBoards = await this.update(userId, {
        author,
      });

      //deleteBoards DeleteResult { raw : [], affected : 1 }
      if (deleteBoards.affected === 0) {
        throw new NotFoundException('There is no boards to delete');
      }

      return true;
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

  async findByUserId(userId: string): Promise<Board[]> {
    try {
      const boards = await this.find({ where: { author: userId } });

      return boards;
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

  async recommendBoard(
    @TransactionManager() transactionManager: EntityManager,
    id: number,
  ): Promise<number> {
    try {
      await this.update(id, {
        likes: () => 'likes + 1',
      });

      const board = await transactionManager.findOne(Board, {
        where: { id: id },
      });
      Logger.log(`recommendBoard SQL result set : ${board.likes}`);
      return board.likes;
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

  async findMoreThan10Likes(date: Date): Promise<Board[]> {
    try {
      const boards = await this.find({
        where: { likes: MoreThanOrEqual(10), created: date },
      });
      return boards;
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

  async findCursor(pagenationBoardsDto: PagenationBoardsDto): Promise<number> {
    const total = await this.count();
    Logger.log(`total is ${total}`);
    const cursor =
      total - pagenationBoardsDto.count * (pagenationBoardsDto.page - 1) + 1;
    if (total < pagenationBoardsDto.count) return total + 1;
    else return cursor;
  } //1200개 게시물 . 1200 - 20 = 1201(1페이지) 1181(2페이지) 1161(3페이지)
  //1개 게시물. 1 - 0 = 1(1페이지)

  async loadPagenationBoards(
    pagenationBoardsDto: PagenationBoardsDto,
    cursor: number,
  ): Promise<Board[]> {
    const boards = await this.find({
      order: {
        id: 'DESC',
      },
      where: {
        id: LessThan(cursor), //Not LessEqualThan, 'limit' load N boards next to cursor.
      },
      take: pagenationBoardsDto.count, //limit
    });

    return boards;
  }

  async findLikesCursor(
    pagenationBoardsDto: PagenationBoardsDto,
  ): Promise<number> {
    const queryBuilder = this.createQueryBuilder('boards')
      .select([
        'boards.id',
        'boards.author',
        'boards.likes',
        'boards.title',
        'boards.content',
        'boards.created',
        'boards.updated',
        'boards.deleted',
        `CONCAT(LPAD(boards.likes, 6, '0'), LPAD(board.id, 10, '0')) AS cursor`,
      ])
      .orderBy('cursor', 'DESC');

    const paginator = buildPaginator({
      entity: Board,
      paginationKeys: [''],
    });
  }
}
