import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { otpReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { UnprocessableEntityError } from '../../../shared/errors';
import { otpViewStub, userStub } from '../../../shared/tests/stubs/models.stub';
import { Role } from '../../../shared/enum/role.enum';
import {
  GenerateActivationCodeAction,
  createGenerateActivationCodeAction,
} from './generate-activation-code.action';

describe('generateActivationCode', () => {
  let repository: UserRepository;
  let generateActivationCode: GenerateActivationCodeAction;

  const input = {
    email: 'john.doe@company.com',
  };

  beforeEach(() => {
    repository = createUserRepository({});
  });

  it('throws an error if otp exists and cannot be regenerated yet', async () => {
    await repository.create({
      ...userStub,
      role: Role.notActive,
    });
    generateActivationCode = createGenerateActivationCodeAction(
      repository,
      otpReadModelStub({
        ...otpViewStub,
        canBeRegenerated: false,
      }),
      eventEmitterDummy
    );

    await assert.rejects(
      () => generateActivationCode(input),
      new UnprocessableEntityError(
        'It is not possible to generate another activation code so quickly.'
      )
    );
  });
});
