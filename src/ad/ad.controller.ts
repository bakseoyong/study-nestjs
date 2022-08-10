import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdService } from './ad.service';
import { CreateAdvertiserDto } from './dto/create-advertiser.dto';
import { UpdateAdvertiserDto } from './dto/update-advertiser.dto';

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
    summary: '광고주 계정 업데이트 API',
    description: '광고주 계정 업데이트.',
  })
  @Post('/update-advertiser')
  updateAdvertiser(
    @Body() updateAdvertiserDto: UpdateAdvertiserDto,
  ): Promise<UpdateAdvertiserDto> {
    return this.adService.updateAdvertiser(updateAdvertiserDto);
  }

  @ApiOperation({
    summary: '광고주 계정 삭제 API',
    description: '광고주 계정 삭제.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete-advertiser/:id')
  deleteAdvertiser(@Param('id') id: number): Promise<boolean> {
    return this.adService.deleteAdvertiser(id);
  }

  // @ApiOperation({
  //   summary: '광고 게시 API',
  //   description: '광고주가 광고를 게시하고 담당자가 심사합니다.',
  // })
  // @Get('/post-ad')
  // createAd(@Body() createAdDto: CreateAdDto): Promise<CreateAdDto> {
  //   return this.adService.createAdvertiser(createAdDto);
  // }
}
