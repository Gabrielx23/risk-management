import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { otpStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { refreshTokenRepositoryContractTest } from './refresh-token.repository.contract.test';
import { createRefreshTokenRepository } from './repository.factory';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);
  refreshTokenRepositoryContractTest(
    'SQL',
    () => {
      return createRefreshTokenRepository({ db });
    },
    async () => {
      await db.deleteFrom('refreshTokens').execute();
      await db.deleteFrom('users').execute();
    },
    async () => {
      await db
        .insertInto('users')
        .values(
          omit(
            {
              ...userStub,
              id: otpStub.userId,
            },
            ['settings']
          )
        )
        .execute();
    }
  );
})();
