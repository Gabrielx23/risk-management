import { Request } from 'express';

import { AUTH_COOKIE_NAME } from '../../app/defaults';

export const getTokenFromAuthCookie = (
  request: Request,
  tokenType: 'authToken' | 'refreshToken',
  authCookieName = AUTH_COOKIE_NAME
): string | null => {
  const tokenPair = request?.cookies[authCookieName];

  if (!tokenPair) {
    return null;
  }

  return tokenPair[tokenType] ?? null;
};
