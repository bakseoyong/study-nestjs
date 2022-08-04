import { EntityRepository, Repository } from 'typeorm';
import { Advertiser } from 'src/entity/advertiser.entity';

@EntityRepository(Advertiser) //@EntityRepository deprecated in typeorm@^0.3.6
export class AdvertiserRepository extends Repository<Advertiser> {}
