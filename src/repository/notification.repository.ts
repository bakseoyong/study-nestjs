import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Notification, NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { CreateNotiDto } from 'src/notification/dto/create-noti.dto';
import { NewBoardNotiToFollowersDto } from 'src/notification/dto/new-board-noti-to-followers.dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Notification) //@EntityRepository deprecated in typeorm@^0.3.6
export class NotificationRepository extends Repository<Notification> {
  //다른 알람은 통합된걸로 만들어보자
  async createNoti(createNotiDto: CreateNotiDto): Promise<boolean> {
    try {
      const { from, url, to, notiType } = createNotiDto;
      let content: string;
      switch (notiType) {
        case NotificationType.FOLLWER_BOARD:
          content = `${to}가 새글을 작성했습니다.`;
          break;
        case NotificationType.WRITE_BOARD_COMMENT:
          content = `${to}가 댓글을 작성했습니다.`;
          break;
        case NotificationType.WRITE_BOARD_LIKES:
          content = `${to}가 작성한 게시글에 좋아요를 눌렀습니다.`;
          break;
        case NotificationType.WRITE_COMMENT_COMMENT:
          content = `${to}가 대댓글을 작성했습니다.`;
          break;
        case NotificationType.WRITE_COMMENT_LIKES:
          content = `${to}가 작성한 댓글에 좋아요를 눌렀습니다.`;
          break;
        default:
          break;
      }

      for (const t of to) {
        const notification = new Notification();
        notification.to = UserActivity.from(t);
        notification.url = url;
        notification.from = from;
        notification.content = content;
        this.save(notification);
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

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.find({
        where: { receiver: userId },
        order: { created: 'DESC' },
      });
      return notifications;
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
