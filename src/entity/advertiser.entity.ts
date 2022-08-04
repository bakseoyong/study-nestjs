import { ApiProperty } from '@nestjs/swagger';
import {
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

@Entity({ name: 'advertiser' })
@Unique(['id'])
//BaseEntity는 Active Record를 사용하기 위해 상속됨
export class Advertiser {
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

  @Column('integer', { default: 0 })
  charge: number;

  //컨셉 : AdManager는 담당자 지정 알고리즘을 통해 파라미터로 전달
  //오류 해결 : 리턴값으로 프로미스 형식을 둘러싼 Advertiser객체를 리턴하려고 하니 this객체에 적용이 안됐었음.
  async create(
    createAdvertiserDto: CreateAdvertiserDto,
    adManager: AdManager,
  ): Promise<Advertiser> {
    const { uid, name, email } = createAdvertiserDto;
    const password = await bcrypt.hash(createAdvertiserDto.password, 10);
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.password = password;

    adManager.approveAccount(this);
    return this;
  }

  //다른객체의 상태를 변경할때 (매니저가 광고주의 상태를 변경) 하는게 유의해야 하는 것이 있는지 검색 해보기
  setStatus(adManager: AdManager, advertiserStatus: AdvertiserStatus) {
    if (adManager.getRole() === Role.MANAGER) {
      this.status = advertiserStatus;
    }
  }
}
