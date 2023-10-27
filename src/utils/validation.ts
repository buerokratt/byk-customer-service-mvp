import { TFunction } from 'react-i18next';
import { MESSAGE_MAX_CHAR_LIMIT, ROLES } from './constants';
import { User } from '../model/user.model';
import { RolesWithReadableNames } from '../model/role.model';

export interface validationResult {
  result: boolean;
  resultMessage: string;
}

export const CheckAgainstCharacterLimit = (textToValidate: string): boolean => !!textToValidate.trim() && textToValidate.length < MESSAGE_MAX_CHAR_LIMIT;

export const AdminUsers = (users: User[]): User[] => users.filter((user) => user.authorities.includes(ROLES.ROLE_ADMINISTRATOR));

export const isLobaIntent = (intentName: string): boolean => intentName.toLowerCase().startsWith('common') || intentName.toLowerCase().startsWith('common_');

export const validateExistingAdmins = (
  currentUsers: User[],
  rolesToAssign: RolesWithReadableNames[],
  changingUserId: string,
  t: TFunction<'translation', undefined> | undefined,
): validationResult => {
  const adminUsers = AdminUsers(currentUsers);
  const willAssignAdminRole = !!rolesToAssign.find((role) => role.code === ROLES.ROLE_ADMINISTRATOR);

  if (adminUsers.length > 1) {
    return { result: true, resultMessage: '' };
  }

  if (!willAssignAdminRole && adminUsers.length === 1 && adminUsers[0].idCode === changingUserId) {
    if (t === undefined) {
      return { result: false, resultMessage: '' };
    }

    return { result: false, resultMessage: t('editUser.lastAdminWarningMessage') };
  }

  return { result: true, resultMessage: '' };
};
