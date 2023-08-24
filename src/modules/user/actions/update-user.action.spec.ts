import assert from 'assert';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { userStub } from '../../../shared/tests/stubs/models.stub';
import { Language } from '../../../shared/enum/language.enum';
import { UpdateUserAction, createUpdateUserAction } from './update-user.action';
import { Role } from '../../../shared/enum/role.enum';
import {
  NotFoundError,
  UnprocessableEntityError,
} from '../../../shared/errors';
import { UpdateUserInput } from '../models/input';

describe('updateUser', () => {
  let repository: UserRepository;
  let updateUser: UpdateUserAction;

  const input: UpdateUserInput = {
    id: userStub.id,
    name: 'Updated John',
    email: 'updated@email.com',
    role: Role.user,
    settings: {
      language: Language.pl,
    },
  };

  beforeEach(() => {
    repository = createUserRepository({});
    updateUser = createUpdateUserAction(repository, clockStub());
  });

  it('throws an error if user does not exist', async () => {
    await assert.rejects(
      () => updateUser({ ...input, id: 'non-existing-user' }),
      new NotFoundError('User does not exist.')
    );
  });

  it('throws an error if selected email address is already in use', async () => {
    await repository.create(userStub);
    await repository.create({
      ...userStub,
      id: '200db642-a014-46dc-b678-fc2777b4b302',
      email: 'already@used.com',
    });

    await assert.rejects(
      () =>
        updateUser({
          ...input,
          email: 'already@used.com',
          id: userStub.id,
        }),
      new UnprocessableEntityError('Selected email address is already in use.')
    );
  });

  it('properly updates selected user', async () => {
    const id = '200db642-a014-46dc-b678-fc2777b4b303';
    await repository.create({ ...userStub, id });

    await updateUser({
      ...input,
      id,
    });

    const user = await repository.findById(id);
    assert.deepEqual(user, {
      ...user,
      ...input,
      id,
      updatedAt: clockDateStub,
    });
  });
});
