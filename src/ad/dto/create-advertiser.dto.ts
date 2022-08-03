import { Advertiser } from 'src/entity/advertiser.entity';

export class CreateAdvertiserDto {
  uid: string;

  password: string;

  name: string;

  email: string;
}
