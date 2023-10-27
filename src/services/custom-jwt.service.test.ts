import http, { customJwtAxios } from './http.service';
import CustomJwtService, { customJwt } from './custom-jwt.service';

jest.mock('./http.service');

describe('CustomJwt Service', () => {
  it('should make a request to /cs-custom-jwt-blacklist', () => {
    CustomJwtService.customJwtBlacklist();
    expect(http.post).toHaveBeenCalledWith('/cs-custom-jwt-blacklist', customJwt);
  });

  it('should make http request to cs-custom-jwt-extend', () => {
    CustomJwtService.customJwtExtend();
    expect(http.post).toHaveBeenCalledWith('/cs-custom-jwt-extend', customJwt);
  });

  it('should make http request to custom-jwt-userinfo', () => {
    CustomJwtService.customJwtUserinfo();
    expect(http.post).toHaveBeenCalledWith('/cs-custom-jwt-userinfo', customJwt);
  });

  it('should make http request to custom-jwt-verify', () => {
    CustomJwtService.customJwtVerify();
    expect(customJwtAxios.post).toHaveBeenCalledWith('/jwt/custom-jwt-verify', customJwt);
  });
});
