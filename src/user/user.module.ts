import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserActivityRepository,
      UserProfileRepository,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
