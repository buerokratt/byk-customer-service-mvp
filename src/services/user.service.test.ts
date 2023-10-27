import { UserInDetailModal } from '../model/user.model';
import http from './http.service';
import UserService from './user.service';
import { ROLES } from '../utils/constants';

jest.mock('../services/http.service');

describe('UserService', () => {
  const newUser: UserInDetailModal = {
    userIdCode: '123',
    displayName: 'newUser',
    roles: [ROLES.ROLE_ADMINISTRATOR],
  };

  it('should make a request to /cs-get-admins', () => {
    UserService.findAllUsers();
    expect(http.post).toHaveBeenCalledWith('/cs-get-admins');
  });

  it('should make a request to /cs-get-customer-support-agents', () => {
    UserService.findAllCustomerSupportAgents();
    expect(http.post).toHaveBeenCalledWith('/cs-get-customer-support-agents');
  });

  it('should make a request to /cs-add-user', () => {
    UserService.addUser(newUser);
    expect(http.post).toHaveBeenCalledWith('/cs-add-user', newUser);
  });

  it('should make a request to /cs-delete-user', () => {
    const userIdCode = 'EE600019906';
    UserService.deleteUser(userIdCode);
    expect(http.post).toHaveBeenCalledWith('/cs-delete-user', { userIdCode });
  });

  it('should make a request to /cs-edit-user', () => {
    UserService.editUser(newUser);
    expect(http.post).toHaveBeenCalledWith('/cs-edit-user', newUser);
  });
});
