import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { HashtagRepository } from 'src/repository/hashtag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HashtagRepository])],
  providers: [HashtagService],
  controllers: [HashtagController],
})
export class HashtagModule {}
