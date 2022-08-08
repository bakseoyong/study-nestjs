import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role, UserProfile } from 'src/entity/user-profile.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserActivityDto } from './dto/user-activity.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { WrittenBoardsDto } from './dto/written-board.dto';
import { UserService } from './user.service';

@ApiTags('유저 API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성합니다.',
  })
  @Post('/create-user')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '프로필 조회 API',
    description: '프로필을 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/read-profile/:id')
  readProfile(@Param('id') id, @Req() req): Promise<UserProfileDto> {
    return this.userService.readProfile(id, req.user);
  }

  @ApiOperation({
    summary: '활동내역 조회 API',
    description: '활동내역을 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/read-activity/:id')
  readActivity(@Param('id') id, @Req() req): Promise<UserActivityDto> {
    return this.userService.readActivity(id, req.user);
  }

  @ApiOperation({
    summary: '유저 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch('/update-user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  updateUser(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Req() req,
  ): Promise<UserProfileDto> {
    return this.userService.update(updateUserProfileDto, req.user);
  }

  @ApiOperation({
    summary: '유저 삭제 (본인)) API',
    description: '회원탈퇴를 합니다.',
  })
  @Delete('/delete-user/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteUserBySelf(@Param('id') id: string, @Req() req): Promise<boolean> {
    return this.userService.delete(id, req.user);
  }

  @ApiOperation({
    summary: '유저 조회 API',
    description: '모든 유저를 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/read-all-user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  readAllUser(@Req() req): Promise<UserProfile[]> {
    return this.userService.readAllUser(req.user);
  }

  @ApiOperation({
    summary: 'JWT 로그인 API',
    description: '요청 헤더에 JWT 토큰을 verify하여 인증합니다.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/auth-login')
  login(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: '유저가 작성한 게시글 목록 API',
    description: '유저가 작성한 게시글 목록을 조회합니다.',
  })
  @Get('/written-boards/:id')
  @UsePipes(ValidationPipe)
  getBoards(@Param('id') userId: string): Promise<WrittenBoardsDto> {
    return this.userService.getBoards(userId);
  }
}
