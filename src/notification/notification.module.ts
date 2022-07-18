import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService, TypeOrmModule],
})
export class NotificationModule {}
