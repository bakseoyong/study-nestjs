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
  MoreThanOrEqual,
  Repository,
  TransactionManager,
} from 'typeorm';
import { PaginationBoardDto } from 'src/board/dto/pagination-boards.dto';
import { Scrap } from 'src/entity/scrap.entity';
import { UpdateBoardDto } from 'src/board/dto/update-board.dto';

@EntityRepository(Board) //@EntityRepository deprecated in typeorm@^0.3.6
export class BoardRepository extends Repository<Board> {
  async getBoardById(
    @TransactionManager() transactionManager: EntityManager,
    id: number,
  ): Promise<Board> {
    try {
      const board = await transactionManager.findOne(Board, {
        where: { id: id },
      });

      if (!board) {
        throw new NotFoundException('board does not exist');
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

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    try {
      //this.insert() return Promoise<InsertResult>
      const board = await this.save(createBoardDto);

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

  async getSortedLikesBoards(
    paginationBoardDto: PaginationBoardDto,
  ): Promise<Board[]> {
    let cursor = paginationBoardDto.cursor;
    if (cursor === undefined) {
      cursor = '999999' + '9999999999';
    }
    const boards = await getConnection()
      .createQueryBuilder()
      .select([
        'boards.id',
        'boards.author',
        'boards.likes',
        'boards.title',
        'boards.content',
        'boards.created',
        'boards.updated',
        'boards.deleted',
        'concat(lpad(boards.likes, 5, ' +
          0 +
          '), lpad(boards.id, 10, ' +
          0 +
          ')) as cursorr',
      ])
      .from(Board, 'boards')
      // Not where !
      .having('cursorr < :cursorr', { cursorr: cursor })
      .orderBy('likes', 'DESC')
      .orderBy('id', 'DESC')
      .take(paginationBoardDto.limit);

    return await boards.execute();
  }

  async getSortedNewlyBoards(
    paginationBoardDto: PaginationBoardDto,
  ): Promise<Board[]> {
    let cursor = paginationBoardDto.cursor;
    if (cursor === undefined) {
      cursor = '999999' + '9999999999';
    }
    const boards = await getConnection()
      .createQueryBuilder()
      .select(
        'concat(lpad(boards.likes, 5, ' +
          0 +
          '), lpad(boards.id, 10, ' +
          0 +
          ')) as cursorr',
      )
      // .addSelect(
      //   'concat(lpad(boards.likes, 5, ' +
      //     0 +
      //     '), lpad(boards.id, 10, ' +
      //     0 +
      //     ')) as cursorr',
      // )
      .from(Board, 'boards')
      .orderBy('likes', 'DESC')
      .orderBy('id', 'DESC')
      .take(paginationBoardDto.limit);

    return await boards.execute();
  }

  async getPopularBoards(): Promise<Board[]> {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    // Logger.log(date);
    return await this.find({
      where: {
        likes: MoreThanOrEqual(5),
        created: MoreThanOrEqual(date),
      },
    });
    // return [];
  }

  async createComment(
    @TransactionManager() transactionManager: EntityManager,
    id: number,
  ): Promise<boolean> {
    try {
      await transactionManager.update(Board, id, {
        comments: () => 'comments + 1',
      });

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

  async createScrap(
    @TransactionManager() transactionManager: EntityManager,
    id: number,
    scrap: Scrap,
  ): Promise<Board> {
    try {
      const board = await transactionManager.findOne(Board, id, {
        relations: ['scrap'],
      });

      //board.scrap.push(scrap);

      await transactionManager.update(Board, id, {
        scraps: () => 'scraps + 1',
      });

      return await transactionManager.save(board);
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

  async getAuthorById(boardId: number): Promise<string> {
    try {
      const board = await this.findOne({
        where: { id: boardId },
      });
      return board ? board.author : null;
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

  async updateBoard(
    userId: string,
    updateBoardDto: UpdateBoardDto,
    boardId: number,
  ): Promise<Board> {
    const { title, content, ...other } = updateBoardDto;

    const board = await this.findOne(boardId);

    board.title = title;
    board.content = content;

    const updatedBoard = await this.save(board);
    return updatedBoard;
  }
}
