import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { problemStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { riskMetricReadModelContractTest } from './risk-metric.read-model.contract.test';
import { RiskMetric } from '../models/risk-metric';
import { riskMetricSqlReadModel } from './risk-metric-sql.read-model';
import { createRiskMetricRepository } from '../repositories/repository.factory';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);
  const repository = createRiskMetricRepository({ db });

  riskMetricReadModelContractTest(
    'SQL',
    async (recordsToAdd: RiskMetric[]) => {
      const operations: Promise<void>[] = [];
      recordsToAdd.forEach(async (record: RiskMetric) =>
        operations.push(repository.create(record))
      );
      await Promise.all(operations);

      return riskMetricSqlReadModel(db);
    },
    async () => {
      await db.deleteFrom('problems').execute();
      await db.deleteFrom('riskMetrics').execute();
      await db.deleteFrom('users').execute();
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
