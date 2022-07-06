import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { CommentRepository } from 'src/repository/comment.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      BoardRepository,
      RecommendRepository,
      ReportRepository,
      CommentRepository,
      ScrapRepository,
    ]),
  ],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
