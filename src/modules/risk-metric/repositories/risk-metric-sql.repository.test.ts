import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { problemStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { createRiskMetricRepository } from './repository.factory';
import { riskMetricRepositoryContractTest } from './risk-metric.repository.contract.test';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);

  riskMetricRepositoryContractTest(
    'SQL',
    () => createRiskMetricRepository({ db }),
    async () => {
      await db.deleteFrom('userSettings').execute();
      await db.deleteFrom('users').execute();
      await db.deleteFrom('riskMetrics').execute();
      await db.deleteFrom('problems').execute();
    },
    async () => {
      await db
        .insertInto('users')
        .values(omit(userStub, ['settings']))
        .execute();
      await db.insertInto('problems').values(problemStub).execute();
      await db
        .insertInto('problems')
        .values({
          ...problemStub,
          id: '200db642-a014-46dc-b678-fc2777b4b302',
        })
        .execute();
    }
  );
})();
