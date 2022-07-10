import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Notification } from 'src/entity/notification.entity';
import { CreateNotiDto } from './dto/create-noti.dto';
import { NewBoardNotiToFollowersDto } from './dto/new-board-noti-to-followers.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/following-new-board')
  newBoardNotiToFollowers(@Body() body): Promise<boolean> {
    Logger.log(body.followers);

    const newBoardNotiToFollowersDto: NewBoardNotiToFollowersDto = {
      receivers: body.followers,
      url: body.url,
      creator: body.creator,
    };

    return this.notificationService.newBoardNotiToFollowers(
      newBoardNotiToFollowersDto,
    );
  }

  @Post('/create')
  createNoti(@Body() createNotiDto: CreateNotiDto): Promise<boolean> {
    return this.notificationService.createNoti(createNotiDto);
  }

  @Get('/get-notifications')
  @UseGuards(JwtAuthGuard)
  getNotifications(@Req() req): Promise<Notification[]> {
    return this.notificationService.getNotifications(req.user.id);
  }
}
