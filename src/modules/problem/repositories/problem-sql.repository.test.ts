import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { userStub } from '../../../shared/tests/stubs/models.stub';
import { problemRepositoryContractTest } from './problem.repository.contract.test';
import { createProblemRepository } from './repository.factory';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);

  problemRepositoryContractTest(
    'SQL',
    () => createProblemRepository({ db }),
    async () => {
      await db.deleteFrom('users').execute();
      await db.deleteFrom('problems').execute();
    },
    async () => {
      await db
        .insertInto('users')
        .values(omit(userStub, ['settings']))
        .execute();
    }
  );
})();
