import { UserRole } from '@/enums/user-role.enum';

export interface UserResponse {
  users: User[];
}

export interface User {
  _id: string;
  email: string;
  firstNames: string;
  lastNames: string;
  roles: UserRole[];
  __v: number;
}
