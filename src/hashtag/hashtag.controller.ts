import { Body, Controller, Post } from '@nestjs/common';
import { Hashtag } from 'src/entity/hashtag.entity';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post('/find-or-create')
  findOrCreateHashtags(@Body() body): Promise<Hashtag[]> {
    return this.hashtagService.findOrCreateHashtags(body.tagNames);
  }

  @Post('/create-board-hashtag')
  createBoardHashtag(@Body() body): Promise<boolean> {
    return this.hashtagService.createBoardHashtag(body);
  }
}
