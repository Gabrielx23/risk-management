import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { otpReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { UnprocessableEntityError } from '../../../shared/errors';
import { otpViewStub, userStub } from '../../../shared/tests/stubs/models.stub';
import {
  ResetPasswordAction,
  createResetPasswordAction,
} from './reset-password.action';

describe('resetPassword', () => {
  let repository: UserRepository;
  let resetPassword: ResetPasswordAction;

  const input = {
    email: 'john.doe@company.com',
  };

  beforeEach(() => {
    repository = createUserRepository({});
  });

  it('throws an error if otp exists and cannot be regenerated yet', async () => {
    await repository.create(userStub);
    resetPassword = createResetPasswordAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        canBeRegenerated: false,
      }),
      eventEmitterDummy
    );

    await assert.rejects(
      () => resetPassword(input),
      new UnprocessableEntityError(
        'It is not possible to generate another password reset code so quickly.'
      )
    );
  });
});
