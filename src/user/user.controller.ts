import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
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
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserProfile> {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: '유저 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch('/update-user')
  @UsePipes(ValidationPipe)
  updateUser(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<boolean> {
    return this.userService.updateUserProfile(updateUserProfileDto);
  }

  @ApiOperation({
    summary: '유저 삭제 (본인)) API',
    description: '회원탈퇴를 합니다.',
  })
  @Delete('/delete-user-by-self')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteUserBySelf(id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({
    summary: '유저 삭제 (관리자) API',
    description: '관리자가 유저를 삭제합니다.',
  })
  @Delete('/delete-user-by-role')
  @Roles([Role.ADMIN, Role.MANAGER])
  @UsePipes(ValidationPipe)
  deleteUserByRole(id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({
    summary: '유저 조회 API',
    description: '모든 유저를 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/read-all-user')
  @UsePipes(ValidationPipe)
  readAllUser(): Promise<UserProfile[]> {
    return this.userService.readAllUser();
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
}
