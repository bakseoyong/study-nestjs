import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdRepository } from 'src/repository/ad.repository';
import { AdvertiserRepository } from 'src/repository/advertiser.repository';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdRepository, AdvertiserRepository])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
