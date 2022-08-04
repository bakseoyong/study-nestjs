import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdService } from './ad.service';
import { CreateAdvertiserDto } from './dto/create-advertiser.dto';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @ApiOperation({
    summary: '광고주 계정 회원가입 API',
    description: '광고주 계정 회원가입.',
  })
  @Post('/create-advertiser')
  getRelationById(
    @Body() createAdvertiserDto: CreateAdvertiserDto,
  ): Promise<CreateAdvertiserDto> {
    return this.adService.createAdvertiser(createAdvertiserDto);
  }
}
