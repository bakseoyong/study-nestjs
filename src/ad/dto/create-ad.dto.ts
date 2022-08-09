import { AdFeatureType } from 'src/entity/ad.entity';
import { Advertiser } from 'src/entity/advertiser.entity';

export class CreateAdDto {
  advertiser: Advertiser;
  created: Date;
  terminated: Date;
  url: string;
  type: AdFeatureType;
}
