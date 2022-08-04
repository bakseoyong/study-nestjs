import { EntityRepository, Repository } from 'typeorm';
import { Ad } from 'src/entity/ad.entity';

@EntityRepository(Ad) //@EntityRepository deprecated in typeorm@^0.3.6
export class AdRepository extends Repository<Ad> {}
