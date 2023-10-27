import http from './http.service';
import { User, UserInDetailModal } from '../model/user.model';

class UserService {
  findAllUsers(): Promise<User[]> {
    return http.post('/cs-get-admins');
  }

  findAllCustomerSupportAgents(): Promise<User[]> {
    return http.post('/cs-get-customer-support-agents');
  }

  addUser(user: UserInDetailModal): Promise<unknown[]> {
    return http.post('/cs-add-user', user);
  }

  deleteUser(userIdCode: string): Promise<void> {
    return http.post('/cs-delete-user', { userIdCode });
  }

  editUser(user: UserInDetailModal): Promise<unknown[]> {
    return http.post('/cs-edit-user', user);
  }

  findAllEstablishments(): Promise<[]> {
    return http.post('/cs-get-all-establishments');
  }
}

export default new UserService();
