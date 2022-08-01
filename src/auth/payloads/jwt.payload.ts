import { Department, Role } from 'src/entity/user-profile.entity';

export type Payload = {
  id: string;
  role: Role;
  dept: Department;
};
