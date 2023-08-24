import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import {
  ActivateUserAction,
  createActivateUserAction,
} from './activate-user.action';
import { otpReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { UnprocessableEntityError } from '../../../shared/errors';
import { otpViewStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { Role } from '../../../shared/enum/role.enum';
import { clockStub } from '../../../shared/tests/stubs/clock.stub';

describe('activateUser', () => {
  let repository: UserRepository;
  let activateUser: ActivateUserAction;

  const input = {
    email: 'john.doe@company.com',
    otp: 'some-otp',
  };

  beforeEach(() => {
    repository = createUserRepository({});
    activateUser = createActivateUserAction(
      repository,
      otpReadModelStub(),
      eventEmitterDummy,
      clockStub()
    );
  });

  it('throws an error if user does not exist', async () => {
    await assert.rejects(
      () => activateUser(input),
      new UnprocessableEntityError('Activation code is incorrect.')
    );
  });

  it('throws an error if user is already activated', async () => {
    await repository.create({
      ...userStub,
      role: Role.user,
    });

    await assert.rejects(
      () => activateUser(input),
      new UnprocessableEntityError('Activation code is incorrect.')
    );
  });

  it('throws an error if otp does not exist', async () => {
    await repository.create({
      ...userStub,
      role: Role.notActive,
    });
    activateUser = createActivateUserAction(
      repository,
      otpReadModelStub(null),
      eventEmitterDummy,
      clockStub()
    );

    await assert.rejects(
      () => activateUser(input),
      new UnprocessableEntityError('Activation code is incorrect.')
    );
  });

  it('throws an error if otp is expired', async () => {
    await repository.create({
      ...userStub,
      role: Role.notActive,
    });
    activateUser = createActivateUserAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        isExpired: true,
      }),
      eventEmitterDummy,
      clockStub()
    );

    await assert.rejects(
      () => activateUser(input),
      new UnprocessableEntityError('Activation code is incorrect.')
    );
  });

  it('activates user if otp is valid', async () => {
    await repository.create({
      ...userStub,
      role: Role.notActive,
    });
    activateUser = createActivateUserAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        isExpired: false,
      }),
      eventEmitterDummy,
      clockStub()
    );

    await activateUser(input);

    const updatedUser = await repository.findById(userStub.id);
    assert.equal(updatedUser?.role, Role.user);
  });
});
