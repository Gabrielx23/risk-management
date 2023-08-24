import { createHasher } from '../../../app/factories/hasher.factory';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { createUserRepository } from '../repositories/repository.factory';
import { createUserReadModel } from './read-model.factory';
import { userReadModelContractTest } from './user.read-model.contract.test';

(function () {
  if (config.DATABASE_URL) {
    const db = createDb(config.DATABASE_URL);
    const userRepository = createUserRepository({ db });

    userReadModelContractTest(
      'SQL',
      () => {
        return createUserReadModel({ db, hasher: createHasher() });
      },
      async () => {
        await db.deleteFrom('users').execute();
      },
      userRepository
    );
  }
})();
