import { createUserRepository } from './repository.factory';
import { userRepositoryContractTest } from './user.repository.contract.test';

userRepositoryContractTest(
  'in-memory',
  () => {
    return createUserRepository({});
  },
  async () => {}
);
