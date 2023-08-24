import { Transaction } from 'kysely';

import { createAddRiskMetricAction } from './actions/add-risk-metric.action';
import { createRiskMetricReadModel } from './read-models/read-model.factory';
import { createRiskMetricRepository } from './repositories/repository.factory';
import { createRiskMetricsRouter } from './routers/risk-metrics.router';
import { DB } from '../../db/types';
import { now } from '../../shared/clock';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
  createActionWithTx,
} from '../../shared/composition-root';
import { uuidGenerator } from '../../shared/uuid';
import { createProblemReadModel } from '../problem/read-models/read-model.factory';

export const createRiskMetricCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  authMiddleware,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, coverTx, inMemoryDb } = dbDefinition;
  inMemoryDb.set('riskMetrics', new Map([]));

  return {
    routers: [
      createRiskMetricsRouter({
        addRiskMetric: createActionWithTx(
          (db?: Transaction<DB>) =>
            createAddRiskMetricAction(
              createRiskMetricRepository({ db: dbInstance, inMemoryDb }),
              createProblemReadModel({
                db: dbInstance,
                inMemoryDb,
              }),
              uuidGenerator,
              now
            ),
          coverTx
        ),
        riskMetricReadModel: createRiskMetricReadModel({
          db: dbInstance,
          inMemoryDb,
        }),
        authMiddleware,
      }),
    ],
    activeListeners: [],
    cleanApp: async (): Promise<void> => {
      dbInstance && (await dbInstance.deleteFrom('riskMetrics').execute());
    },
  };
};
