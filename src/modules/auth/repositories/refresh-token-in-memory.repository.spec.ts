import { refreshTokenRepositoryContractTest } from './refresh-token.repository.contract.test';
import { createRefreshTokenRepository } from './repository.factory';

refreshTokenRepositoryContractTest(
  'in-memory',
  () => {
    return createRefreshTokenRepository({});
  },
  async () => {},
  async () => {}
);
