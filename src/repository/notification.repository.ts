import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Notification } from 'src/entity/notification.entity';
import { NewBoardNotiToFollowersDto } from 'src/notification/dto/new-board-noti-to-followers.dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Notification) //@EntityRepository deprecated in typeorm@^0.3.6
export class NotificationRepository extends Repository<Notification> {
  async newBoardNotiToFollowers(
    newBoardNotiToFollowersDto: NewBoardNotiToFollowersDto,
  ): Promise<boolean> {
    try {
      const { receivers, url, creator } = newBoardNotiToFollowersDto;
      for (const receiver of receivers) {
        this.save({ receiver: receiver, url: url, creator: creator });
      }
      return true;
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
