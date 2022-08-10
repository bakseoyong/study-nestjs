import { ApiProperty } from '@nestjs/swagger';
import { CreateAdDto } from 'src/ad/dto/create-ad.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AdManager } from './adManager.entity';
import { Advertiser } from './advertiser.entity';
import { Role } from './user-profile.entity';

export const AdStatus = {
  심사: 1,
  게시: 2,
  종료: 3,
  차단: 4,
  중단: 5,
  승인: 6,
} as const;

export const AdFeature = {
  미지정: 0,
  행사: 1,
  판매: 2,
  공익: 3,
} as const;

export type AdStatusType = typeof AdStatus[keyof typeof AdStatus];
export type AdFeatureType = typeof AdFeature[keyof typeof AdFeature];

@Entity({ name: 'ad' })
@Unique(['id'])
export class Ad {
  @ApiProperty({
    example: 1,
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '네이버',
    description: '광고주',
  })
  @ManyToOne((type) => Advertiser, (advertiser) => advertiser.ads)
  advertiser: Advertiser;

  @CreateDateColumn()
  created: Date;

  @Column('date')
  terminated: Date;

  @Column('boolean', { default: 1 }) //심사
  status: AdStatusType;

  @Column('varchar')
  url: string;

  @Column('integer', { default: 0 }) //미지정
  type: AdFeatureType;

  @Column('integer')
  view: number;

  @Column('integer')
  click: number;

  //수정, 종료기간 연장, 종료, 해당광고 요금계산
  static craete(createAdDto: CreateAdDto, adManager: AdManager): Ad {
    const ad = new Ad();
    const { advertiser, created, terminated, url, type } = createAdDto;
    ad.advertiser = advertiser;
    ad.created = created;
    ad.terminated = terminated;
    ad.url = url;
    ad.type = type;
    adManager.approveAd(ad);
    return ad;
  }

  setStatus(adManager: AdManager, adStatus: AdStatusType) {
    if (adManager.getRole() === Role.MANAGER) {
      this.status = adStatus;
    }
  }
}
