import { NextFunction, Request, Response } from 'express';

import { UserView } from '../../modules/user/models/output';
import { UnauthorizedError } from '../../shared/errors';
import { getTokenFromAuthCookie } from '../../shared/helpers/get-token-from-auth-cookie';
import { Jwt } from '../../shared/jwt';
import { Middleware } from '../../shared/middleware/middleware';

export const createAuthMiddleware =
  (jwt: Jwt): Middleware =>
  (request: Request, _response: Response, next: NextFunction): void => {
    const token = getTokenFromAuthCookie(request, 'authToken');

    if (!token) {
      return next(new UnauthorizedError('Missing auth identity. Log in.'));
    }

    const decodedJwt = jwt.verify<{ data: UserView }>(token);

    if (!decodedJwt || !decodedJwt.data) {
      return next(new UnauthorizedError('Incorrect auth token.'));
    }

    request.user = decodedJwt.data;

    next();
  };
