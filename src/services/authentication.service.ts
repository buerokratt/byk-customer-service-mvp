import http from './http.service';

export interface CustomerSupportStatus {
  userIdCode: string;
  active: string;
}

export interface ConfigurationResult {
  id: number;
  name: string;
  value: string;
  deleted: boolean;
}

class AuthenticationService {
  login(login: string, password: string): Promise<void> {
    return http.post('/cs-login', { login, password });
  }

  loginAnalytics(): Promise<void> {
    return http.post('/cs-login-analytics', {});
  }

  loginWithTaraJwt(): Promise<void> {
    return http.post('/cs-login-with-tara-jwt');
  }

  logout(): Promise<void> {
    return http.post('/cs-logout');
  }

  getCustomerSupportStatus(customerSupportId: string): Promise<CustomerSupportStatus[]> {
    return http.post('/cs-get-customer-support-activity', { customerSupportId });
  }

  setCustomerSupportStatus(customerSupportStatus: string, customerSupportId: string): Promise<CustomerSupportStatus[]> {
    return http.post('/cs-set-customer-support-activity', { customerSupportStatus, customerSupportId });
  }

  setSessionLength(sessionLength: number): Promise<void> {
    return http.post('/cs-set-session-length', { sessionLength });
  }

  getSessionLength(): Promise<ConfigurationResult[]> {
    return http.post('/cs-get-session-length');
  }
}

export default new AuthenticationService();
