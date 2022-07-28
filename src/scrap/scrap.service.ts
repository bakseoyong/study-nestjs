import { Injectable } from '@nestjs/common';
import { BoardService } from 'src/board/board.service';
import { Board } from 'src/entity/board.entity';
import { Scrap } from 'src/entity/scrap.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { ScrapRepository } from 'src/repository/scrap.repository';
import { UserService } from 'src/user/user.service';
import { CreateScrapDto } from './dto/create-scrap.dto';

@Injectable()
export class ScrapService {
  constructor(
    private readonly scrapRepository: ScrapRepository,

    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  async create(createScrapDto: CreateScrapDto): Promise<boolean> {
    const { userId, boardId } = createScrapDto;

    //일단 하고 typeorm 전용 브렌치 만들어서 해결해
    const scrap = new Scrap();
    const boardDto = await this.boardService.getById(boardId);
    const userActivityDto = await this.userService.getActivityById(userId);
    scrap.board = Board.from(boardDto);
    scrap.user = UserActivity.from(userActivityDto);
    this.scrapRepository.save(scrap);
    return true;
  }
}
