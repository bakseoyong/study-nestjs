import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { HashtagRepository } from 'src/repository/hashtag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardHashtagRepository } from 'src/repository/board-hashtag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashtagRepository, BoardHashtagRepository]),
  ],
  providers: [HashtagService],
  controllers: [HashtagController],
})
export class HashtagModule {}
