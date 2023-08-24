import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import {
  riskMetricStub,
  userStub,
} from '../../../shared/tests/stubs/models.stub';
import { createProblemRepository } from '../repositories/repository.factory';
import { problemReadModelContractTest } from './problem.read-model.contract.test';
import { Problem } from '../models/problem';
import { problemSqlReadModel } from './problem-sql.read-model';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);
  const repository = createProblemRepository({ db });

  problemReadModelContractTest(
    'SQL',
    async (recordsToAdd: Problem[]) => {
      const operations: Promise<void>[] = [];
      recordsToAdd.forEach(async (record: Problem) =>
        operations.push(repository.create(record))
      );
      await Promise.all(operations);

      await db.insertInto('riskMetrics').values(riskMetricStub).execute();

      return problemSqlReadModel(db);
    },
    async () => {
      await db.deleteFrom('users').execute();
      await db.deleteFrom('problems').execute();
    },
    async () => {
      await db
        .insertInto('users')
        .values(omit(userStub, ['settings']))
        .execute();

      await db
        .insertInto('users')
        .values({
          ...omit(userStub, ['settings']),
          id: '200db642-a014-46dc-b678-fc2777b4b302',
          email: 'some@different.com',
        })
        .execute();
    }
  );
})();
