import { HttpException, HttpStatus } from '@nestjs/common';
import { Board } from 'src/entity/board.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { PaginationBoardDto } from 'src/board/dto/pagination-boards.dto';
import { UserActivityDto } from 'src/user/dto/user-activity.dto';
import _ from 'lodash';

@EntityRepository(Board) //@EntityRepository deprecated in typeorm@^0.3.6
export class BoardRepository extends Repository<Board> {
  async getById(boardId: number): Promise<Board> {
    const board: Board = await this.findOne(boardId);
    return board;
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

  async getUserById(boardId: number): Promise<UserActivityDto> {
    try {
      const board = await this.findOne({
        where: { id: boardId },
      });

      return board ? board.user : null;
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
}
