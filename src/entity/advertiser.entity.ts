import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Ad } from './ad.entity';
import * as bcrypt from 'bcrypt';
import { AdManager } from './adManager.entity';
import { Role } from './user-profile.entity';
import { CreateAdvertiserDto } from 'src/ad/dto/create-advertiser.dto';

export enum AdvertiserStatus {
  심사 = 1,
  승인 = 2,
  거절 = 3,
  제한 = 4,
}

@Entity({ name: 'ad' })
@Unique(['id'])
export class Advertiser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  uid: string;

  @Column('varchar')
  password: string;

  @Column('integer', { default: 1 })
  status: AdvertiserStatus;

  @ApiProperty({
    example: '네이버',
    description: '광고주 이름, 회사명',
  })
  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @OneToMany((type) => Ad, (ad) => ad.advertiser)
  ads: Ad[];

  @Column('integer')
  charge: number;

  //컨셉 : AdManager는 담당자 지정 알고리즘을 통해 파라미터로 전달
  async create(
    createAdvertiserDto: CreateAdvertiserDto,
    adManager: AdManager,
  ): Promise<Advertiser> {
    const advertiser = new Advertiser();
    const { uid, name, email } = createAdvertiserDto;
    const password = await bcrypt.hash(createAdvertiserDto.password, 10);
    advertiser.uid = uid;
    advertiser.name = name;
    advertiser.email = email;
    advertiser.password = password;

    adManager.approveAccount(advertiser);
    return advertiser;
  }

  //다른객체의 상태를 변경할때 (매니저가 광고주의 상태를 변경) 하는게 유의해야 하는 것이 있는지 검색 해보기
  setStatus(adManager: AdManager, advertiserStatus: AdvertiserStatus) {
    if (adManager.getRole() === Role.MANAGER) {
      this.status = advertiserStatus;
    }
  }
}
