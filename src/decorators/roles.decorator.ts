import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/entity/user-profile.entity';

export type AllowedRole = keyof typeof Role | 'Any';

export const Roles = (roles: AllowedRole[]) => SetMetadata('roles', roles);
