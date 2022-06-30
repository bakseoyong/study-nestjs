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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
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

  @Delete('/delete-user')
  @UsePipes(ValidationPipe)
  deleteUser(no: string): Promise<boolean> {
    return this.userService.deleteUser(no);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/read-all-user')
  @UsePipes(ValidationPipe)
  readAllUser(): Promise<User[]> {
    return this.userService.readAllUser();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth-login')
  async login(@Request() req) {
    return req.user;
  }
}
