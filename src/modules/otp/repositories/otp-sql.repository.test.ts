import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { otpStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { otpRepositoryContractTest } from './otp.repository.contract.test';
import { createOtpRepository } from './repository.factory';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);

  otpRepositoryContractTest(
    'SQL',
    () => createOtpRepository({ db }),
    async () => {
      await db.deleteFrom('otp').execute();
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
