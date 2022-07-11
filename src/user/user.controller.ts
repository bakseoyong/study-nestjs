import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role, User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return this.userService.createUser(createUserDto);
  }

  @Patch('/update-user')
  @UsePipes(ValidationPipe)
  updateUser(@Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete('/delete-user-by-self')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteUserBySelf(id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @Delete('/delete-user-by-role')
  @Roles([Role.ADMIN, Role.MANAGER])
  @UsePipes(ValidationPipe)
  deleteUserByRole(id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/read-all-user')
  @UsePipes(ValidationPipe)
  readAllUser(): Promise<User[]> {
    return this.userService.readAllUser();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth-login')
  login(@Request() req) {
    return req.user;
  }
}
