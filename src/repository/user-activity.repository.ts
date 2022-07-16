import { EntityRepository, Repository } from 'typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';

@EntityRepository(UserActivity) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserActivityRepository extends Repository<UserActivity> {}
