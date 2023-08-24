import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import {
  userStub,
  userViewStub,
} from '../../../shared/tests/stubs/models.stub';
import {
  ChangePasswordAction,
  createChangePasswordAction,
} from './change-password.action';
import {
  hasherHashStub,
  hasherStub,
} from '../../../shared/tests/stubs/hasher.stub';
import { UnprocessableEntityError } from '../../../shared/errors';
import { clockStub } from '../../../shared/tests/stubs/clock.stub';

describe('changePassword', () => {
  let repository: UserRepository;
  let changePassword: ChangePasswordAction;

  const input = {
    password: 'some-new-password',
    passwordConfirmation: 'some-new-password',
    oldPassword: 'some-password',
  };

  beforeEach(() => {
    repository = createUserRepository({});
    changePassword = createChangePasswordAction(
      repository,
      eventEmitterDummy,
      hasherStub(),
      clockStub()
    );
  });

  it('throws an error if user does not exist', async () => {
    await assert.rejects(
      changePassword(input, { ...userViewStub, id: 'some-id' }),
      new UnprocessableEntityError('Password change failed.')
    );
  });

  it('throws an error if old password does not match', async () => {
    await repository.create(userStub);
    changePassword = createChangePasswordAction(
      repository,
      eventEmitterDummy,
      hasherStub(hasherHashStub, false),
      clockStub()
    );

    await assert.rejects(
      changePassword(input, userViewStub),
      new UnprocessableEntityError('Old password is incorrect.')
    );
  });

  it('properly updates user password', async () => {
    await repository.create(userStub);
    changePassword = createChangePasswordAction(
      repository,
      eventEmitterDummy,
      hasherStub(hasherHashStub, true),
      clockStub()
    );

    await changePassword(input, userViewStub);

    const user = await repository.findById(userStub.id);
    assert.deepStrictEqual(user, {
      ...userStub,
      password: hasherHashStub,
    });
  });
});
