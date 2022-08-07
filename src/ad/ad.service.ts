import { Injectable, Logger } from '@nestjs/common';
import { Advertiser } from 'src/entity/advertiser.entity';
import { AdvertiserRepository } from 'src/repository/advertiser.repository';
import { AdRepository } from 'src/repository/ad.repository';
import { CreateAdvertiserDto } from './dto/create-advertiser.dto';
import { Role } from 'src/entity/user-profile.entity';
import { AdManager } from 'src/entity/adManager.entity';

@Injectable()
export class AdService {
  constructor(
    private readonly adRepoistory: AdRepository,
    private readonly advertiserRepository: AdvertiserRepository,
  ) {}

  async matchingManager(): Promise<AdManager> {
    // const counts = await this.adManagerRepository.count();
    // const index = Math.floor(Math.random() * (counts + 1));
    // return this.adManagerRepository.findOne(index);

    const adManager = new AdManager();
    adManager.role = Role.MANAGER;
    return adManager;
  }

  async createAdvertiser(
    createAdvertiserDto: CreateAdvertiserDto,
  ): Promise<CreateAdvertiserDto> {
    const adManager = await this.matchingManager();
    const advertiser = new Advertiser();
    await advertiser.create(createAdvertiserDto, adManager);
    adManager.approveAccount(advertiser);
    this.advertiserRepository.save(advertiser);
    return advertiser;
  }
}