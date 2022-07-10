import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/entity/hashtag.entity';
import { HashtagRepository } from 'src/repository/hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(private readonly hashtagRepository: HashtagRepository) {}

  async findOrCreateHashtags(tagNames: string[]): Promise<Hashtag[]> {
    const hashtags: Hashtag[] = [];

    for (const tagName of tagNames) {
      let hashtag: Hashtag = await this.hashtagRepository.findByTagName(
        tagName,
      );

      if (!hashtag) {
        hashtag = await this.hashtagRepository.createTag(tagName);
      }

      hashtags.push(hashtag);
    }
    return hashtags;
  }
}
