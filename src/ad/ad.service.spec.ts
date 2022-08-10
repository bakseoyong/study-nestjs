import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdService } from './ad.service';
import { Advertiser } from 'src/entity/advertiser.entity';
import { UpdateAdvertiserDto } from './dto/update-advertiser.dto';
import { AdvertiserRepository } from 'src/repository/advertiser.repository';

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('광고 서비스 계층 테스트', () => {
  let service: AdService;
  let advertiserRepository: MockRepository<AdvertiserRepository>;

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      providers: [
        AdService,
        {
          provide: getRepositoryToken(AdvertiserRepository),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = modules.get<AdService>(AdService);
    advertiserRepository = modules.get(
      getRepositoryToken(AdvertiserRepository),
    );
  });

  it('광고 서비스 정의됨', () => {
    expect(service).toBeDefined();
  });

  it('광고주 계정 업데이트에 실패한다.', async () => {
    //given
    const origin = Advertiser.create({
      uid: 'originTest',
      password: 'originPassword!1',
      name: 'originName',
      email: 'originEmail@email.com',
    });

    const updateAdvertiserDto: UpdateAdvertiserDto = {
      id: 1,
      uid: 'updateTest',
      password: 'updatePassword!1',
      name: 'updateName',
      email: 'updateEmail@email.com',
    };

    const expected: UpdateAdvertiserDto = {
      id: 1,
      uid: 'updateTest',
      password: 'updatePassword!1',
      name: 'updateName',
      email: 'updateEmail@email.com',
    };

    //when
    advertiserRepository.save.mockResolvedValue(undefined);
    advertiserRepository.findOne.mockResolvedValue(origin);
    const updated: UpdateAdvertiserDto = await service.updateAdvertiser(
      updateAdvertiserDto,
    );

    //then
    //같은 객체를 가리키는지 확인하려면 toBe
    //객체의 내용이 같은지를 확인하려면 toEqual
    expect(updated).not.toBe(expected);
  });

  it('광고주 계정 업데이트에 성공한다.', async () => {
    //given
    const origin = Advertiser.create({
      uid: 'originTest',
      password: 'originPassword!1',
      name: 'originName',
      email: 'originEmail@email.com',
    });

    const updateAdvertiserDto: UpdateAdvertiserDto = {
      id: 1,
      uid: 'updateTest',
      password: 'updatePassword!1',
      name: 'updateName',
      email: 'updateEmail@email.com',
    };

    const expected: UpdateAdvertiserDto = {
      id: 1,
      uid: 'updateTest',
      password: 'updatePassword!1',
      name: 'updateName',
      email: 'updateEmail@email.com',
    };

    //when
    advertiserRepository.save.mockResolvedValue(expected);
    advertiserRepository.findOne.mockResolvedValue(origin);
    const updated: UpdateAdvertiserDto = await service.updateAdvertiser(
      updateAdvertiserDto,
    );

    //then
    //같은 객체를 가리키는지 확인하려면 toBe
    //객체의 내용이 같은지를 확인하려면 toEqual
    expect(updated).toEqual(expected);
  });

  it('광고주 계정 삭제 실패', async () => {
    //given
    const id = 1;
    advertiserRepository.delete.mockResolvedValue({ affected: 0 });

    //when
    const result: boolean = await service.deleteAdvertiser(id);

    //then
    expect(result).toEqual(false);
  });

  it('광고주 계정 삭제 성공', async () => {
    //given
    const id = 1;
    advertiserRepository.delete.mockResolvedValue({ affected: 1 });

    //when
    const result: boolean = await service.deleteAdvertiser(id);

    //then
    expect(result).toEqual(true);
  });
});
