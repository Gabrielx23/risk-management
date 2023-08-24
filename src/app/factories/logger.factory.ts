import pino from 'pino';

import { Config } from '../../config';
import { Logger } from '../../shared/logger';

export const createLogger = (config: Config): Logger => {
  return pino({
    level: config.MODE,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });
};
