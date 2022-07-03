import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { CreateCommentDto } from 'src/board/dto/create-comment.dto';
import { Comment } from 'src/entity/comment.entity';

@EntityRepository(Comment) //@EntityRepository deprecated in typeorm@^0.3.6
export class CommentRepository extends Repository<Comment> {
  async createComment(createCommentDto: CreateCommentDto): Promise<boolean> {
    try {
      const { boardId, content, commenter } = createCommentDto;
      const comment = await this.save({ boardId, content, commenter });
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
