import { Injectable } from '@nestjs/common';
import { Scrap } from 'src/entity/scrap.entity';
import { BoardRepository } from 'src/repository/board.repository';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { UserActivityRepository } from 'src/repository/user-activity.repository';
import { CreateScrapDto } from './dto/create-scrap.dto';

@Injectable()
export class ScrapService {
  constructor(
    private readonly scrapRepository: ScrapRepository,
    private readonly boardRepository: BoardRepository,
    private readonly userActivityRepository: UserActivityRepository,
  ) {}

  async create(createScrapDto: CreateScrapDto): Promise<boolean> {
    const { userId, boardId } = createScrapDto;

    const scrap = new Scrap();
    const board = await this.boardRepository.findOne(boardId);
    const user = await this.userActivityRepository.findOne(userId);
    scrap.create(user, board);
    this.scrapRepository.save(scrap);
    return true;
  }

  async delete(boardId: number, userId: string): Promise<boolean> {
    const user = await this.userActivityRepository.findOne(userId);
    const board = await this.boardRepository.findOne(boardId);
    const scrap = user.getScrapOne(board);
    const deleteResult = await this.scrapRepository.delete(scrap);
    if (deleteResult.affected === 1) {
      return true;
    } else {
      return false;
    }
  }
}
