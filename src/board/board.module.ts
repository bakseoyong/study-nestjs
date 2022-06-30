import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { RecommendRepository } from 'src/repository/recommend.repository';
import { ReportRepository } from 'src/repository/report.repository';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardRepository,
      RecommendRepository,
      ReportRepository,
    ]),
  ],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
