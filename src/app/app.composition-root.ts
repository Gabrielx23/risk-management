import * as ejs from 'ejs';
import { Router } from 'express';
import { Kysely } from 'kysely';
import * as fs from 'node:fs';

import { SUPPORTED_LANGUAGES } from './defaults';
import { createAuthMiddleware } from './factories/auth-middleware.factory';
import { createEventEmitter } from './factories/event-emitter.factory';
import { createHasher } from './factories/hasher.factory';
import { createJwt } from './factories/jwt.factory';
import { createLogger } from './factories/logger.factory';
import { createMailer } from './factories/mailer.factory';
import { createRandomizer } from './factories/randomizer.factory';
import { createRenderer } from './factories/renderer.factory';
import { createTranslator } from './factories/translator.factory';
import { Config } from '../config';
import { createDb, transactional } from '../db/db';
import { DB } from '../db/types';
import { compositionRootFactories } from '../modules';
import {
  CompositionRootFactory,
  AppCleaner,
  IModuleCompositionRoot,
} from '../shared/composition-root';
import { Language } from '../shared/enum/language.enum';
import { AppEventListenerName } from '../shared/events/event-listener';
import { InMemoryDb } from '../shared/in-memory.db';

export const appCompositionRoot = (
  config: Config,
  factories: CompositionRootFactory[] = compositionRootFactories
): IModuleCompositionRoot => {
  let inMemoryDb: InMemoryDb = new Map<string, Map<string, any>>([]);

  const setupTranslations = (): Record<Language, Record<string, string>> => {
    const translations = {} as Record<Language, Record<string, string>>;
    SUPPORTED_LANGUAGES.forEach((language: Language) => {
      translations[language] = JSON.parse(
        fs.readFileSync(`${__dirname}/../shared/i18n/${language}.json`, 'utf8')
      );
    });

    return translations;
  };

  const cleanApp = async (
    db: Kysely<DB> | null,
    cleaners: AppCleaner[]
  ): Promise<void> => {
    for (const cleaner of cleaners) {
      await cleaner({ db });
    }

    inMemoryDb = new Map<string, Map<string, any>>([]);
  };

  const db = config.DATABASE_URL ? createDb(config.DATABASE_URL) : null;
  const logger = createLogger(config);
  const eventEmitter = createEventEmitter(logger);
  const jwt = createJwt(config.JWT_SECRET);

  const cleaners: AppCleaner[] = [];
  let routers: Router[] = [];
  let activeListeners: AppEventListenerName[] = [];
  for (const createCompositionRoot of factories) {
    const {
      routers: compositionRootRouters,
      cleanApp,
      activeListeners: compositionRootActiveListeners,
    } = createCompositionRoot({
      dbDefinition: {
        dbInstance: db ?? null,
        coverTx: db ? transactional(db) : null,
        inMemoryDb,
      },
      config,
      logger,
      eventEmitter,
      hasher: createHasher(),
      jwt,
      randomizer: createRandomizer(),
      authMiddleware: createAuthMiddleware(jwt),
      translator: createTranslator(setupTranslations()),
      renderer: createRenderer(ejs),
      mailer: createMailer(config, logger),
    });
    cleanApp && cleaners.push(cleanApp);
    routers = [...routers, ...compositionRootRouters];
    activeListeners = [...activeListeners, ...compositionRootActiveListeners];
  }

  return {
    routers,
    activeListeners,
    cleanApp: () => cleanApp(db, cleaners),
  };
};
