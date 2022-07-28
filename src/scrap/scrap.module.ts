import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from 'src/board/board.module';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { UserModule } from 'src/user/user.module';
import { ScrapController } from './scrap.controller';
import { ScrapService } from './scrap.service';

@Module({
  imports: [
    BoardModule,
    UserModule,
    TypeOrmModule.forFeature([ScrapRepository]),
  ],
  providers: [ScrapService],
  controllers: [ScrapController],
})
export class ScrapModule {}
