import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { createUserRepository } from './repository.factory';
import { userRepositoryContractTest } from './user.repository.contract.test';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);

  userRepositoryContractTest(
    'SQL',
    () => createUserRepository({ db }),
    async () => {
      await db.deleteFrom('users').execute();
    }
  );
})();
