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
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { UpdateAdvertiserDto } from 'src/ad/dto/update-advertiser.dto';

export const AdvertiserStatus = {
  심사: 1,
  승인: 2,
  거절: 3,
  제한: 4,
} as const;

export type AdvertiserStatusType =
  typeof AdvertiserStatus[keyof typeof AdvertiserStatus];

@Entity({ name: 'advertisers' })
@Unique(['id'])
//BaseEntity는 Active Record를 사용하기 위해 상속됨
export class Advertiser {
  //이용량이 많지 않으므로 uuid 사용 x
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  uid: string;

  @Column('varchar')
  password: string;

  @Column('integer', { default: 1 })
  status: AdvertiserStatusType;

  @ApiProperty({
    example: '네이버',
    description: '광고주 이름, 회사명',
  })
  @Column('varchar')
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
  })
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    comment: 'Email Address',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/, {
    message: 'Enter a email that not follow the format',
  })
  email: string;

  @OneToMany((type) => Ad, (ad) => ad.advertiser)
  ads: Ad[];

  @Column('integer', { default: 0 })
  charge: number;

  //컨셉 : AdManager는 담당자 지정 알고리즘을 통해 파라미터로 전달
  //오류 해결 : 리턴값으로 프로미스 형식을 둘러싼 Advertiser객체를 리턴하려고 하니 this객체에 적용이 안됐었음.
  static async create(
    createAdvertiserDto: CreateAdvertiserDto,
  ): Promise<Advertiser> {
    const advertiser = new Advertiser();
    const { uid, name, email } = createAdvertiserDto;
    const password = await bcrypt.hash(createAdvertiserDto.password, 10);
    advertiser.uid = uid;
    advertiser.name = name;
    advertiser.email = email;
    advertiser.password = password;
    return advertiser;
  }

  async update(updateAdvertiserDto: UpdateAdvertiserDto): Promise<boolean> {
    const { uid, name, email } = updateAdvertiserDto;
    const password = await bcrypt.hash(updateAdvertiserDto.password, 10);
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.password = password;
    return true;
  }

  //다른객체의 상태를 변경할때 (매니저가 광고주의 상태를 변경) 하는게 유의해야 하는 것이 있는지 검색 해보기
  setStatus(adManager: AdManager, advertiserStatus: AdvertiserStatusType) {
    if (adManager.getRole() === Role.MANAGER) {
      this.status = advertiserStatus;
    }
  }
}
