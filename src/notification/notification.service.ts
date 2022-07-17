import { Injectable } from '@nestjs/common';
import { Notification } from 'src/entity/notification.entity';
import { NotificationRepository } from 'src/repository/notification.repository';
import { CreateNotiDto } from './dto/create-noti.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  createNoti(createNotiDto: CreateNotiDto): Promise<boolean> {
    return this.notificationRepository.createNoti(createNotiDto);
  }

  getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.getNotifications(userId); //orderby
  }
}
