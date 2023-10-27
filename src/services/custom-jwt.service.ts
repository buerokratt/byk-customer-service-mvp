import { AxiosResponse } from 'axios';
import http, { customJwtAxios } from './http.service';
import { UserInfo } from '../model/tim-response.model';

export const customJwt = 'customJwtCookie';

class CustomJwtService {
  customJwtBlacklist(): Promise<void> {
    return http.post('/cs-custom-jwt-blacklist', customJwt);
  }

  customJwtExtend(): Promise<void> {
    return http.post('/cs-custom-jwt-extend', customJwt);
  }

  customJwtUserinfo(): Promise<UserInfo> {
    return http.post('/cs-custom-jwt-userinfo', customJwt);
  }

  customJwtVerify(): Promise<AxiosResponse> {
    return customJwtAxios.post('/jwt/custom-jwt-verify', customJwt);
  }
}

export default new CustomJwtService();
