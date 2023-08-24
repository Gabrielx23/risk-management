import assert from 'assert';
import { CreateUserAction, createUserAction } from './create-user.action';
import { DEFAULT_USER_ROLE, DEFAULT_USER_SETTINGS } from '../defaults';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import { idGeneratorStub } from '../../../shared/tests/stubs/id-generator.stub';
import {
  hasherHashStub,
  hasherStub,
} from '../../../shared/tests/stubs/hasher.stub';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { userStub } from '../../../shared/tests/stubs/models.stub';
import { CreateUserInput } from '../models/input';
import { Language } from '../../../shared/enum/language.enum';

describe('createUser', () => {
  let repository: UserRepository;
  let createUser: CreateUserAction;

  const input: CreateUserInput = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'password',
    passwordConfirmation: 'password',
    settings: {
      language: userStub.settings.language as Language,
    },
  };

  beforeEach(() => {
    repository = createUserRepository({});
    createUser = createUserAction(
      repository,
      idGeneratorStub(),
      hasherStub(),
      clockStub(),
      eventEmitterDummy
    );
  });

  it('properly creates new user', async () => {
    const userId = await createUser(input);

    const userById = await repository.findById(userId);

    assert.deepEqual(userById, {
      id: userId,
      name: input.name,
      email: input.email,
      password: hasherHashStub,
      role: DEFAULT_USER_ROLE,
      settings: {
        ...DEFAULT_USER_SETTINGS,
        ...input.settings,
      },
      createdAt: clockDateStub,
      updatedAt: clockDateStub,
    });
  });

  it('throws an error if email is already in use', async () => {
    await createUser(input);

    await assert.rejects(() => createUser(input));
  });
});
