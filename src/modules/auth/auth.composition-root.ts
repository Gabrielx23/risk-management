import { Transaction } from 'kysely';

import {
  GenerateTokenPairAction,
  createGenerateTokenPairAction,
} from './actions/generate-token-pair.action';
import { createInvalidateRefreshTokenAction } from './actions/invalidate-refresh-token.action';
import { createLogInAction } from './actions/log-in.action';
import { createRefreshTokenAction } from './actions/refresh-token.action';
import { createRefreshTokenRepository } from './repositories/repository.factory';
import { createAuthRouter } from './routers/auth.router';
import { DB } from '../../db/types';
import { now } from '../../shared/clock';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
  createActionWithTx,
} from '../../shared/composition-root';
import { createUserReadModel } from '../user/read-models/read-model.factory';

export const createAuthCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  eventEmitter,
  hasher,
  randomizer,
  jwt,
  authMiddleware,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, coverTx, inMemoryDb } = dbDefinition;
  inMemoryDb.set('refreshTokens', new Map([]));
  const userReadModel = createUserReadModel({
    db: dbInstance,
    inMemoryDb,
    hasher,
  });

  const createGenerateTokenPairActionFn = (
    db?: Transaction<DB>
  ): GenerateTokenPairAction =>
    createGenerateTokenPairAction(
      jwt,
      randomizer,
      createRefreshTokenRepository({ db, inMemoryDb }),
      now
    );

  return {
    routers: [
      createAuthRouter({
        logIn: createActionWithTx(
          (db?: Transaction<DB>) =>
            createLogInAction(
              createGenerateTokenPairActionFn(db),
              userReadModel,
              eventEmitter
            ),
          coverTx
        ),
        refreshToken: createActionWithTx(
          (db?: Transaction<DB>) =>
            createRefreshTokenAction(
              createGenerateTokenPairActionFn(db),
              createRefreshTokenRepository({ db, inMemoryDb }),
              userReadModel,
              now,
              eventEmitter
            ),
          coverTx
        ),
        invalidateRefreshToken: createActionWithTx(
          (db?: Transaction<DB>) =>
            createInvalidateRefreshTokenAction(
              createRefreshTokenRepository({ db, inMemoryDb }),
              eventEmitter
            ),
          coverTx
        ),
        authMiddleware,
      }),
    ],
    activeListeners: [],
    cleanApp: async (): Promise<void> => {
      dbInstance && (await dbInstance.deleteFrom('users').execute());
    },
  };
};
