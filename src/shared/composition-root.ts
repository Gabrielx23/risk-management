import { Router } from 'express';
import { Kysely, Transaction } from 'kysely';

import { EventEmitter } from './events/event-emitter';
import { AppEventListenerName } from './events/event-listener';
import { Hasher } from './hasher';
import { Jwt } from './jwt';
import { Logger } from './logger';
import { Mailer } from './mailer';
import { Middleware } from './middleware/middleware';
import { Randomizer } from './randomizer';
import { Renderer } from './renderer';
import { Translator } from './translator';
import { Config } from '../config';
import { WithTx } from '../db/db';
import { DB } from '../db/types';

export type AppCleaner = (params: { db: Kysely<DB> | null }) => Promise<void>;

export type CompositionRootFactoryParams = {
  dbDefinition: {
    dbInstance: Kysely<DB> | null;
    coverTx: WithTx<DB> | null;
    inMemoryDb: Map<string, Map<string, any>>;
  };
  config: Config;
  logger: Logger;
  eventEmitter: EventEmitter;
  hasher: Hasher;
  randomizer: Randomizer;
  jwt: Jwt;
  translator: Translator;
  renderer: Renderer;
  mailer: Mailer;
  authMiddleware: Middleware;
};

export type CompositionRootFactory = (
  params: CompositionRootFactoryParams
) => IModuleCompositionRoot;

export interface IModuleCompositionRoot {
  routers: Router[];
  activeListeners: AppEventListenerName[];
  cleanApp: AppCleaner;
}

export const createActionWithTx = <A extends any[], R>(
  actionFactoryFn: (db?: Transaction<DB>) => (...args: A) => Promise<R>,
  coverTx: WithTx<DB> | null
): ((...args: A) => Promise<R>) => {
  return coverTx ? coverTx(actionFactoryFn) : actionFactoryFn();
};
