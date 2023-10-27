import { validateExistingAdmins } from './validation';
import { User } from '../model/user.model';
import { ROLES } from './constants';
import { RolesWithReadableNames } from '../model/role.model';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const user: User = {
  login: 'string',
  firstName: 'string',
  lastName: 'string',
  idCode: 'idCode1',
  displayName: 'string',
  authorities: [ROLES.ROLE_ADMINISTRATOR],
};

const t = undefined;

describe('validate existing admins', () => {
  it('should return true if 2 admins exist and 1 admin is removed', () => {
    const user2 = { ...user, authorities: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_CHATBOT_TRAINER], idCode: 'idCode2' };
    const userId = 'idCode2';
    const currentUsers: User[] = [user2, user];
    const selectedRoles: RolesWithReadableNames[] = [{ code: ROLES.ROLE_ANALYST, name: '' }];
    const res = validateExistingAdmins(currentUsers, selectedRoles, userId, t);
    expect(res.result).toBe(true);
  });

  it('should return false if last admin adm role is removed', () => {
    const userId = 'idCode1';
    const currentUsers: User[] = [user];
    const selectedRoles: RolesWithReadableNames[] = [{ code: ROLES.ROLE_ANALYST, name: '' }];
    const res = validateExistingAdmins(currentUsers, selectedRoles, userId, t);
    expect(res.result).toBe(false);
  });

  it('should return true if last admin other roles is changed', () => {
    const userId = 'idCode2';
    const currentUsers: User[] = [user];
    const selectedRoles: RolesWithReadableNames[] = [
      { code: ROLES.ROLE_ANALYST, name: '' },
      { code: ROLES.ROLE_ADMINISTRATOR, name: '' },
    ];
    const res = validateExistingAdmins(currentUsers, selectedRoles, userId, t);
    expect(res.result).toBe(true);
  });
});
