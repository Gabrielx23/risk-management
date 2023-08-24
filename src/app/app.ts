import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Router } from 'express';

import { appCompositionRoot } from './app.composition-root';
import { httpErrorHandler, notFoundHandler } from './http-error.handler';
import { Config } from '../config';
import { UserView } from '../modules/user/models/output';
import { AppCleaner } from '../shared/composition-root';
import { ForbiddenError } from '../shared/errors';

export type App = {
  app: Application;
  cleanApp: AppCleaner | null;
};

declare global {
  namespace Express {
    interface Request {
      user: UserView;
    }
  }
}

const addRouters = (
  app: Application,
  routers: Router[],
  endpointsPrefix?: string
): void => {
  for (const router of routers) {
    app.use(endpointsPrefix ?? '', router);
  }
};

export const createApp = (config: Config): App => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: (origin, callback) => {
        const whiteList = config.CORS_WHITELIST.split(',');

        if (whiteList[0] !== '*' && (!origin || !whiteList.includes(origin))) {
          return callback(new ForbiddenError('Not allowed by CORS'));
        }

        callback(null, true);
      },
    })
  );

  const { routers, cleanApp } = appCompositionRoot(config);

  addRouters(app, routers, config.ENDPOINT_PREFIX);

  app.use(notFoundHandler);
  app.use(httpErrorHandler);

  return { app, cleanApp };
};
