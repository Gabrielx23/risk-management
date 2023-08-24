import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { otpReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { UnprocessableEntityError } from '../../../shared/errors';
import { otpViewStub, userStub } from '../../../shared/tests/stubs/models.stub';
import {
  ApplyPasswordResetAction,
  createApplyPasswordResetAction,
} from './apply-password-reset.action';
import {
  hasherHashStub,
  hasherStub,
} from '../../../shared/tests/stubs/hasher.stub';
import { clockStub } from '../../../shared/tests/stubs/clock.stub';

describe('applyPasswordReset', () => {
  let repository: UserRepository;
  let applyPasswordReset: ApplyPasswordResetAction;

  const input = {
    email: userStub.email,
    otp: 'some-otp',
    password: 'new-password',
  };

  beforeEach(() => {
    repository = createUserRepository({});
    applyPasswordReset = createApplyPasswordResetAction(
      repository,
      otpReadModelStub(),
      eventEmitterDummy,
      hasherStub(),
      clockStub()
    );
  });

  it('throws an error if user does not exist', async () => {
    await assert.rejects(
      () => applyPasswordReset(input),
      new UnprocessableEntityError('Confirmation code is incorrect.')
    );
  });

  it('throws an error if otp does not exist', async () => {
    await repository.create(userStub);
    applyPasswordReset = createApplyPasswordResetAction(
      repository,
      otpReadModelStub(null),
      eventEmitterDummy,
      hasherStub(),
      clockStub()
    );

    await assert.rejects(
      () => applyPasswordReset(input),
      new UnprocessableEntityError('Confirmation code is incorrect.')
    );
  });

  it('throws an error if otp is expired', async () => {
    await repository.create(userStub);
    applyPasswordReset = createApplyPasswordResetAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        isExpired: true,
      }),
      eventEmitterDummy,
      hasherStub(),
      clockStub()
    );

    await assert.rejects(
      () => applyPasswordReset(input),
      new UnprocessableEntityError('Confirmation code is incorrect.')
    );
  });

  it('changes password if otp is valid', async () => {
    await repository.create(userStub);
    applyPasswordReset = createApplyPasswordResetAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        isExpired: false,
      }),
      eventEmitterDummy,
      hasherStub(),
      clockStub()
    );

    await applyPasswordReset(input);

    const updatedUser = await repository.findById(userStub.id);
    assert.equal(updatedUser?.password, hasherHashStub);
  });
});
