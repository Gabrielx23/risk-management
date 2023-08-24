import { Request, Response, Router } from 'express';

import { AUTH_COOKIE_NAME } from '../../../app/defaults';
import { getTokenFromAuthCookie } from '../../../shared/helpers/get-token-from-auth-cookie';
import { Middleware } from '../../../shared/middleware/middleware';
import { InvalidateRefreshTokenAction } from '../actions/invalidate-refresh-token.action';
import { LogInAction } from '../actions/log-in.action';
import { RefreshTokenAction } from '../actions/refresh-token.action';
import { AUTH_COOKIE_OPTIONS } from '../defaults';
import { LoginInput, RefreshTokenInput } from '../models/input';

type AuthRouterParams = {
  logIn: LogInAction;
  refreshToken: RefreshTokenAction;
  invalidateRefreshToken: InvalidateRefreshTokenAction;
  authMiddleware: Middleware;
};

export const createAuthRouter = ({
  logIn,
  refreshToken,
  invalidateRefreshToken,
  authMiddleware,
}: AuthRouterParams): Router => {
  const router = Router();
  const baseUrl = '/auth';

  router.post(
    `${baseUrl}/login`,
    async (request: Request, response: Response): Promise<void> => {
      const input = LoginInput.parse(request.body);

      const tokenPair = await logIn(input);

      response.cookie(AUTH_COOKIE_NAME, tokenPair, AUTH_COOKIE_OPTIONS).json();
    }
  );

  router.post(
    `${baseUrl}/logout`,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const refreshToken = getTokenFromAuthCookie(request, 'refreshToken');

      if (refreshToken) {
        await invalidateRefreshToken(refreshToken);
      }

      response.clearCookie(AUTH_COOKIE_NAME).json();
    }
  );

  router.post(
    `${baseUrl}/refresh-token`,
    async (request: Request, response: Response): Promise<void> => {
      const input = RefreshTokenInput.parse({
        refreshToken: getTokenFromAuthCookie(request, 'refreshToken'),
      });

      const tokenPair = await refreshToken(input);

      response.cookie(AUTH_COOKIE_NAME, tokenPair, AUTH_COOKIE_OPTIONS).json();
    }
  );

  return router;
};
