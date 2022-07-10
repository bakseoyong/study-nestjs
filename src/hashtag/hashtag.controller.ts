import { Body, Controller, Get, Logger, Param } from '@nestjs/common';
import { Hashtag } from 'src/entity/hashtag.entity';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get('/find-or-create')
  findOrCreateHashtags(@Body() body): Promise<Hashtag[]> {
    return this.hashtagService.findOrCreateHashtags(body.tagNames);
  }
}
