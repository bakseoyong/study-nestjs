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

    //유튜브 보면서 하니까 집중이 하나도 안된다. typeorm에서 어떻게 여기 집어넣을수 있는지 찾아보자
    //객체를 집어넣어야 되는데 그럴려면 리포지토리에서 직접 가져오는 방법말곤..
    const scrap = new Scrap();
    const boardDto = await this.boardService.getById(boardId);
    const userActivityDto = await this.userService.getActivityById(userId);
    scrap.board = Board.from(boardDto);
    scrap.user = UserActivity.from(userActivityDto);
    this.scrapRepository.save(scrap);
    return true;
  }
}
