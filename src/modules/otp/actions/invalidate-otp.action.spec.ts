import pick from 'lodash.pick';
import { otpStub } from '../../../shared/tests/stubs/models.stub';
import { OtpRepository } from '../models/otp';
import { createOtpRepository } from '../repositories/repository.factory';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import assert from 'assert';
import {
  InvalidateOtpAction,
  createInvalidateOtpAction,
} from './invalidate-otp.action';

describe('invalidateOtp', () => {
  let repository: OtpRepository;
  let invalidateOtp: InvalidateOtpAction;

  const input = pick(otpStub, ['id']);

  beforeEach(() => {
    repository = createOtpRepository({});
    invalidateOtp = createInvalidateOtpAction(repository, eventEmitterDummy);
  });

  it('invalidates existing otp', async () => {
    await repository.create(otpStub);

    await invalidateOtp(input);

    const otp = await repository.findById(input.id);
    assert.equal(otp, null);
  });
});
