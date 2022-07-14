import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Notification } from 'src/entity/notification.entity';
import { CreateNotiDto } from './dto/create-noti.dto';
import { NewBoardNotiToFollowersDto } from './dto/new-board-noti-to-followers.dto';
import { NotificationService } from './notification.service';

@ApiTags('알림 API')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: '팔로우 새글 등록 알림 API',
    description: '팔로워들에게 새로운 글 등록에 대한 알림을 전송합니다.',
  })
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

  @ApiOperation({
    summary: '알림 생성 API',
    description: '알림 타입에 맞춰 알림을 생성합니다.',
  })
  @Post('/create')
  createNoti(@Body() createNotiDto: CreateNotiDto): Promise<boolean> {
    return this.notificationService.createNoti(createNotiDto);
  }

  @ApiOperation({
    summary: '알림 조회 API',
    description: '유저에게 전송된 알림들을 조회합니다.',
  })
  @Get('/get-notifications')
  @UseGuards(JwtAuthGuard)
  getNotifications(@Req() req): Promise<Notification[]> {
    return this.notificationService.getNotifications(req.user.id);
  }

  // @Post('/checked')
  // setCheckedNotification()
}
