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
  createAdvertiser(
    @Body() createAdvertiserDto: CreateAdvertiserDto,
  ): Promise<CreateAdvertiserDto> {
    return this.adService.createAdvertiser(createAdvertiserDto);
  }

  @ApiOperation({
    summary: '광고 게시 API',
    description: '광고주가 광고를 게시하고 담당자가 심사합니다.',
  })
  @Get('/post-ad')
  createAd(@Body() createAdDto: CreateAdDto): Promise<CreateAdDto> {
    return this.adService.createAdvertiser(createAdDto);
  }
}
