//PickType 사용 시 TypeError 발생한다. (
//UserActivity.from에서 UserActivityDto를 참조하고 있기 때문에

import { Board } from 'src/entity/board.entity';

export class WrittenBoardsDto {
  boards: Board[];
}
