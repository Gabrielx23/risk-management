import { otpRepositoryContractTest } from './otp.repository.contract.test';
import { createOtpRepository } from './repository.factory';

otpRepositoryContractTest(
  'in-memory',
  () => {
    return createOtpRepository({});
  },
  async () => {},
  async () => {}
);
