import { createHasher } from '../../../app/factories/hasher.factory';
import { User, UserId } from '../models/user';
import { userInMemoryRepository } from '../repositories/user-in-memory.repository';
import { createUserReadModel } from './read-model.factory';
import { userReadModelContractTest } from './user.read-model.contract.test';

(function () {
  const inMemoryDb = new Map([['users', new Map<UserId, User>([])]]);
  const userRepository = userInMemoryRepository(
    inMemoryDb.get('users') as Map<UserId, User>
  );

  userReadModelContractTest(
    'in-memory',
    () => {
      return createUserReadModel({ inMemoryDb, hasher: createHasher() });
    },
    async () => {},
    userRepository
  );
})();
