import { HttpException, HttpStatus } from '@nestjs/common';
import { Notification } from 'src/entity/notification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Notification) //@EntityRepository deprecated in typeorm@^0.3.6
export class NotificationRepository extends Repository<Notification> {
  async getByUserId(userId: string): Promise<Notification[]> {
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

  async readOne(id: number): Promise<boolean> {
    this.update(id, {
      read: true,
    });

    return true;
  }
}
