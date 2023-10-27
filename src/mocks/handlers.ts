import { rest } from 'msw';

export const testEnv = {
  RUUTER_API_URL: 'http://localhost:8080',
  TIM_API_URL: 'http://localhost:8085',
};

export const handlers = [
  rest.post(`${testEnv.RUUTER_API_URL}/cs-login-with-tara-jwt`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.cookie('custom_jwt_cookie', 'customJwtCookieValue', { httpOnly: true, secure: true }),
      ctx.json({
        data: { custom_jwt_cookie: 'customJwtCookieValue' },
        error: null,
      }),
    ),
  ),

  rest.post(`${testEnv.RUUTER_API_URL}/cs-logout`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.cookie('JWTTOKEN', '', { httpOnly: true, secure: true, expires: new Date(0), maxAge: 0 }),
      ctx.cookie('custom_jwt_cookie', '', { httpOnly: true, secure: true, expires: new Date(0), maxAge: 0 }),
      ctx.json({ data: { blacklist_tara_jwt: null }, error: null }),
    ),
  ),

  rest.post(`${testEnv.RUUTER_API_URL}/cs-custom-jwt-userinfo`, (req, res, ctx) => {
    if (!req.cookies.custom_jwt_cookie) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          custom_jwt_userinfo: {
            firstName: 'SUPER',
            lastName: 'ADMIN',
            idCode: 'EE123456789',
            displayName: null,
            JWTCreated: new Date().getTime(),
            login: 'EE123456789',
            authorities: ['ROLE_ADMINISTRATOR'],
            JWTExpirationTimestamp: new Date().getTime() + 30 * 60 * 1000,
          },
        },
        error: null,
      }),
    );
  }),
];
