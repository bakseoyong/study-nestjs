import { Injectable } from '@nestjs/common';
import { Advertiser } from 'src/entity/advertiser.entity';
import { AdvertiserRepository } from 'src/repository/advertiser.repository';
import { CreateAdvertiserDto } from './dto/create-advertiser.dto';
import { Role } from 'src/entity/user-profile.entity';
import { AdManager } from 'src/entity/adManager.entity';
import { UpdateAdvertiserDto } from './dto/update-advertiser.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AdService {
  constructor(
    // private readonly adRepoistory: AdRepository,
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
    const advertiser = await Advertiser.create(createAdvertiserDto);
    adManager.approveAccount(advertiser);
    this.advertiserRepository.save(advertiser);
    return advertiser;
  }

  async updateAdvertiser(
    updateAdvertiserDto: UpdateAdvertiserDto,
  ): Promise<UpdateAdvertiserDto> {
    const advertiser = await this.advertiserRepository.findOne(
      updateAdvertiserDto.id,
    );
    advertiser.update(updateAdvertiserDto);
    return this.advertiserRepository.save(advertiser);
  }

  async deleteAdvertiser(id: number): Promise<boolean> {
    //TypeORM delete vs remove
    //delete : 아이템이 존재하면 지우고 존재하지 않으면 아무런 영향이 없다.
    //remove : 존재하지 않은 아이템을 지우려고 하면 404 에러 발생
    const result: DeleteResult = await this.advertiserRepository.delete(id);
    if (result.affected === 1) {
      return true;
    }
    return false;
  }
}
