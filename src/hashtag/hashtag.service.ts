import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/entity/hashtag.entity';
import { BoardHashtagRepository } from 'src/repository/board-hashtag.repository';
import { HashtagRepository } from 'src/repository/hashtag.repository';
import { CreateBoardHashtagDto } from './dto/create-hashtag-board.dto';
import { UpdateBoardHashtagDto } from './dto/update-board-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    private readonly hashtagRepository: HashtagRepository,
    private readonly boardHashtagRepository: BoardHashtagRepository,
  ) {}

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

  createBoardHashtags(
    createBoardHashtagDto: CreateBoardHashtagDto,
  ): Promise<boolean> {
    return this.boardHashtagRepository.createBoardHashtags(
      createBoardHashtagDto,
    );
  }

  deleteBoardHashtags(boardId: number): Promise<boolean> {
    return this.boardHashtagRepository.deleteBoardHashtags(boardId);
  }

  async updateBoardHashtags(
    updateBoardHashtagDto: UpdateBoardHashtagDto,
  ): Promise<boolean> {
    await this.deleteBoardHashtags(updateBoardHashtagDto.board.id);
    await this.createBoardHashtags(updateBoardHashtagDto);
    return true;
  }
}
