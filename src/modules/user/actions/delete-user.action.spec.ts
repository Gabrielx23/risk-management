import assert from 'assert';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { UserRepository } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';
import { DeleteUserAction, createDeleteUserAction } from './delete-user.action';
import { userStub } from '../../../shared/tests/stubs/models.stub';

describe('deleteUser', () => {
  let repository: UserRepository;
  let deleteUser: DeleteUserAction;

  beforeEach(() => {
    repository = createUserRepository({});
    deleteUser = createDeleteUserAction(repository, eventEmitterDummy);
  });

  it('deletes user if it exists', async () => {
    await repository.create(userStub);

    await deleteUser(userStub.id);

    const userById = await repository.findById(userStub.id);
    assert.equal(userById, null);
  });
});
