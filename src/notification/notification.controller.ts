import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNotiDto } from './dto/create-noti.dto';
import { NotificationService } from './notification.service';

@ApiTags('알림 API')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: '알림 생성 API',
    description: '알림 타입에 맞춰 알림을 생성합니다.',
  })
  @Post('/create')
  create(@Body() createNotiDto: CreateNotiDto): boolean {
    return this.notificationService.create(createNotiDto);
  }

  @ApiOperation({
    summary: '알림 읽음 API',
    description: '알림을 읽음 표시 합니다.',
  })
  @Post('/read/:id')
  @UseGuards(JwtAuthGuard)
  readOne(@Param('id') id: number): Promise<boolean> {
    return this.notificationService.readOne(id);
  }

  @ApiOperation({
    summary: '알림 전체 읽음 API',
    description: '알림 전체를 읽음 표시 합니다.',
  })
  @Get('/readAll')
  @UseGuards(JwtAuthGuard)
  readAll(@Req() req): Promise<boolean> {
    return this.notificationService.readAll(req.user.id);
  }

  //개별 알림 삭제
  @ApiOperation({
    summary: '알림 삭제 API',
    description: '알림을 삭제합니다.',
  })
  @Get('/delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('id') id): Promise<boolean> {
    return this.notificationService.deleteOne(id);
  }

  @ApiOperation({
    summary: '읽은 알림 삭제 API',
    description: '읽은 알림들을 삭제합니다.',
  })
  @Get('/delete-read')
  @UseGuards(JwtAuthGuard)
  deleteRead(@Req() req): Promise<boolean> {
    return this.notificationService.deleteRead(req.user.id);
  }
}
