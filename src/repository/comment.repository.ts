import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Board } from 'src/entity/board.entity';
import { UserActivity } from 'src/entity/user-activity.entity';

@EntityRepository(Comment) //@EntityRepository deprecated in typeorm@^0.3.6
export class CommentRepository extends Repository<Comment> {
  async createComment(
    board: Board,
    content: string,
    user: UserActivity,
  ): Promise<boolean> {
    try {
      const comment = new Comment();
      comment.board = board;
      comment.content = content;
      comment.user = user;
      comment.save();
      return comment ? true : false;
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

  async getOldest20Comments(
    @TransactionManager() transactionManager: EntityManager,
    boardId: number,
  ): Promise<Comment[]> {
    try {
      const comments = await transactionManager.find(Comment, {
        where: { boardId: boardId },
      });
      return comments;
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
