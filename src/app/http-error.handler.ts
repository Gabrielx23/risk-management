import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ZodError } from 'zod';

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '../shared/errors';

const handlers = new Map([
  [
    NotFoundError.name,
    (response: Response, error: NotFoundError): void => {
      response.status(404).json({ error: error.message });
    },
  ],
  [
    ForbiddenError.name,
    (response: Response, error: ForbiddenError): void => {
      response.status(403).json({ error: error.message });
    },
  ],
  [
    UnauthorizedError.name,
    (response: Response, error: UnauthorizedError): void => {
      response.status(401).json({ error: error.message });
    },
  ],
  [
    UnprocessableEntityError.name,
    (response: Response, error: UnprocessableEntityError): void => {
      response.status(422).json({ error: error.message });
    },
  ],
  [
    ZodError.name,
    (response: Response, error: ZodError): void => {
      response.status(422).json({ errors: error.issues });
    },
  ],
]);

export const notFoundHandler: RequestHandler = (): void => {
  throw new NotFoundError('Route does not exist.');
};

export const httpErrorHandler: ErrorRequestHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const errorHandler = handlers.get(error.name);

  if (errorHandler) {
    errorHandler(response, error as any);

    return;
  }

  console.log(error);

  response.status(500).json();
};
