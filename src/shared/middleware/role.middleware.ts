import { NextFunction, Request, Response } from 'express';

import { Middleware } from './middleware';
import { Role } from '../enum/role.enum';
import { ForbiddenError, UnauthorizedError } from '../errors';

type RoleMiddlewareParams = {
  allowedRoles?: Role[];
  disallowedRoles?: Role[];
};

export type RoleMiddleware = (params: RoleMiddlewareParams) => Middleware;

export const roleMiddleware =
  ({ allowedRoles, disallowedRoles }: RoleMiddlewareParams): Middleware =>
  (request: Request, _response: Response, next: NextFunction): void => {
    const userRole = request.user?.role;
    if (!userRole) {
      return next(new UnauthorizedError('Missing auth identity. Log in.'));
    }

    const isRejectedByAllowedRoles =
      allowedRoles?.length && !allowedRoles.includes(userRole);
    const isRejectedByDisallowedRoles =
      disallowedRoles?.length && disallowedRoles.includes(userRole);

    if (isRejectedByAllowedRoles || isRejectedByDisallowedRoles) {
      return next(
        new ForbiddenError('You are not allowed to perform desired operation.')
      );
    }

    next();
  };
