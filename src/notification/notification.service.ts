import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from 'src/entity/notification.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { NotificationRepository } from 'src/repository/notification.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserService } from 'src/user/user.service';
import { CreateNotiDto } from './dto/create-noti.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userActivityRepository: UserActivityRepository,

    private readonly userService: UserService,
  ) {}

  create(createNotiDto: CreateNotiDto): boolean {
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
      this.notificationRepository.save(notification);
    }

    return true;
  }

  async readOne(id: number): Promise<boolean> {
    const notification = await this.notificationRepository.findOne(id);
    notification.read = true;
    this.notificationRepository.save(notification);
    return true;
  }

  async readAll(userId: string): Promise<boolean> {
    const user = await this.userActivityRepository.findOne(userId);

    user.getNotifications().map((notification) => {
      notification.read = true;
      this.notificationRepository.save(notification);
    });
    return true;
  }

  async deleteOne(id: number): Promise<boolean> {
    this.notificationRepository.delete(id);
    return true;
  }

  async deleteRead(userId: string): Promise<boolean> {
    function isRead(element) {
      if (element.read === 'true') {
        return true;
      }
    }

    const user = await this.userActivityRepository.findOne(userId);

    const reads = user.getNotifications().filter(isRead);
    this.notificationRepository.remove(reads);
    return true;
  }
}
