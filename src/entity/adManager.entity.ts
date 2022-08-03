import { Ad, AdStatus } from './ad.entity';
import { Advertiser, AdvertiserStatus } from './advertiser.entity';
import { Role } from './user-profile.entity';

export class AdManager {
  role: Role;

  approveAccount(advertiser: Advertiser) {
    // 조건 ...
    advertiser.setStatus(this, AdvertiserStatus.승인);
  }

  approveAd(ad: Ad) {
    // 조건 ...
    ad.setStatus(this, AdStatus.승인);
  }

  getRole(): Role {
    return this.role;
  }
}
