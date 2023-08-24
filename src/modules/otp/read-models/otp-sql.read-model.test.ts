import omit from 'lodash.omit';
import { config } from '../../../config';
import { createDb } from '../../../db/db';
import { now } from '../../../shared/clock';
import {
  otpViewStub,
  userStub,
  userViewStub,
} from '../../../shared/tests/stubs/models.stub';
import { createOtpRepository } from '../repositories/repository.factory';
import { createOtpReadModel } from './otp-read-model.factory';
import { otpReadModelContractTest } from './otp.read-model.contract.test';

(function () {
  if (!config.DATABASE_URL) {
    return;
  }

  const db = createDb(config.DATABASE_URL);

  otpReadModelContractTest(
    'SQL',
    () => {
      return createOtpReadModel({ db, clock: now });
    },
    async () => {
      await db.deleteFrom('otp').execute();
      await db.deleteFrom('users').execute();
    },
    async () => {
      await db
        .insertInto('users')
        .values(omit(userStub, ['settings']))
        .execute();
    },
    createOtpRepository({ db })
  );
})();
