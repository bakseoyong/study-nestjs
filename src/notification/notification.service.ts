import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NewBoardNotiToFollowersDto } from './dto/new-board-noti-to-followers.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  newBoardNotiToFollowers(
    newBoardNotiToFollowersDto: NewBoardNotiToFollowersDto,
  ): Promise<boolean> {
    return this.notificationRepository.newBoardNotiToFollowers(
      newBoardNotiToFollowersDto,
    );
  }
}
