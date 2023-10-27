import { ROLES } from '../utils/constants';

export interface User {
  idCode: string;
  displayName: string;
  authorities: ROLES[];
  login?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserInDetailModal {
  userIdCode: string;
  displayName: string;
  roles: ROLES[];
}
