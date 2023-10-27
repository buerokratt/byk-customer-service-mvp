import AuthenticationService from './authentication.service';
import http from './http.service';

jest.mock('../services/http.service');

describe('Authentication Service', () => {
  it('should make a request to /cs-login', () => {
    const login = 'kasutajanimi';
    const password = 'salajane parool';

    AuthenticationService.login(login, password);
    expect(http.post).toHaveBeenCalledWith('/cs-login', { login, password });
  });

  it('should make a request to /cs-logout', () => {
    AuthenticationService.logout();
    expect(http.post).toHaveBeenCalledWith('/cs-logout');
  });

  it('should make a request to /cs-set-agent-status', () => {
    const customerSupportId = '999999';
    const customerSupportStatus = 'true';

    AuthenticationService.setCustomerSupportStatus(customerSupportStatus, customerSupportId);
    expect(http.post).toHaveBeenCalledWith('/cs-set-customer-support-activity', { customerSupportStatus, customerSupportId });
  });

  it('should make a request to /cs-set-session-length', () => {
    AuthenticationService.setSessionLength(10);
    expect(http.post).toHaveBeenCalledWith('/cs-set-session-length', { sessionLength: 10 });
  });

  it('should make a request to /cs-get-session-length', () => {
    AuthenticationService.getSessionLength();
    expect(http.post).toHaveBeenCalledWith('/cs-get-session-length');
  });
});
