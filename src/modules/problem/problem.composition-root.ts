import { Transaction } from 'kysely';

import { createAddProblemAction } from './actions/add-problem.action';
import { createDeleteProblemAction } from './actions/delete-problem.action';
import { createUpdateProblemAction } from './actions/update-problem.action';
import { createProblemReadModel } from './read-models/read-model.factory';
import { createProblemRepository } from './repositories/repository.factory';
import { createProblemsRouter } from './routers/problems.router';
import { DB } from '../../db/types';
import { now } from '../../shared/clock';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
  createActionWithTx,
} from '../../shared/composition-root';
import { uuidGenerator } from '../../shared/uuid';

export const createProblemCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  authMiddleware,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, coverTx, inMemoryDb } = dbDefinition;
  inMemoryDb.set('problems', new Map([]));

  return {
    routers: [
      createProblemsRouter({
        addProblem: createActionWithTx(
          (db?: Transaction<DB>) =>
            createAddProblemAction(
              createProblemRepository({ db: dbInstance, inMemoryDb }),
              now,
              uuidGenerator
            ),
          coverTx
        ),
        deleteProblem: createActionWithTx(
          (db?: Transaction<DB>) =>
            createDeleteProblemAction(
              createProblemRepository({ db: dbInstance, inMemoryDb })
            ),
          coverTx
        ),
        updateProblem: createActionWithTx(
          (db?: Transaction<DB>) =>
            createUpdateProblemAction(
              createProblemRepository({ db: dbInstance, inMemoryDb }),
              now
            ),
          coverTx
        ),
        problemReadModel: createProblemReadModel({
          db: dbInstance,
          inMemoryDb,
        }),
        authMiddleware,
      }),
    ],
    activeListeners: [],
    cleanApp: async (): Promise<void> => {
      dbInstance && (await dbInstance.deleteFrom('problems').execute());
    },
  };
};
