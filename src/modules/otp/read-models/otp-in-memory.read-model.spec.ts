import { clockStub } from '../../../shared/tests/stubs/clock.stub';
import { createOtpRepository } from '../repositories/repository.factory';
import { createOtpReadModel } from './otp-read-model.factory';
import { otpReadModelContractTest } from './otp.read-model.contract.test';

(function () {
  const inMemoryDb = new Map([['otp', new Map<string, any>([])]]);

  otpReadModelContractTest(
    'in-memory',
    () => {
      return createOtpReadModel({
        inMemoryDb,
        clock: clockStub(new Date('2023-08-03T00:00:00.000Z')),
      });
    },
    async () => {},
    async () => {},
    createOtpRepository({ inMemoryDb })
  );
})();
