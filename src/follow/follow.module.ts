import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository } from 'src/repository/follow.repository';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRepository])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
