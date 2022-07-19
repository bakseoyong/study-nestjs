import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BoardHashtag } from 'src/entity/board-hashtag.entity';
import { Board } from 'src/entity/board.entity';
import { CreateBoardHashtagDto } from 'src/hashtag/dto/create-hashtag-board.dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BoardHashtag) //@EntityRepository deprecated in typeorm@^0.3.6
export class BoardHashtagRepository extends Repository<BoardHashtag> {
  async createBoardHashtags(
    createBoardHashtagDto: CreateBoardHashtagDto,
  ): Promise<boolean> {
    try {
      for (const hashtag of createBoardHashtagDto.hashtags) {
        const boardHashtag = new BoardHashtag();
        const board = Board.from(createBoardHashtagDto.board);
        boardHashtag.board = board;
        boardHashtag.hashtag = hashtag;
        this.save(boardHashtag);
      }
      return true;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteBoardHashtags(boardId: number): Promise<boolean> {
    try {
      await this.createQueryBuilder('boardHashtag')
        .delete()
        .where('board_id = :boardId', { boardId: boardId });

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
}
