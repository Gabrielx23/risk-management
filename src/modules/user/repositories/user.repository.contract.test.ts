import { UserRepository } from '../models/user';
import assert from 'assert';
import { userStub } from '../../../shared/tests/stubs/models.stub';

export const userRepositoryContractTest = (
  variant: string,
  createRepository: () => UserRepository,
  clean: () => Promise<void>
) => {
  describe(`User repository contract: ${variant}`, () => {
    let repository: UserRepository;

    beforeEach(async () => {
      await clean();
      repository = createRepository();
    });

    describe('create', () => {
      it('creates user', async () => {
        await repository.create(userStub);

        const userById = await repository.findById(userStub.id);
        assert.deepStrictEqual(userById, userStub);
        const userByEmail = await repository.findByEmail(userStub.email);
        assert.deepStrictEqual(userByEmail, userStub);
      });
    });

    describe('update', () => {
      it('updates user', async () => {
        const newEmail = 'john2@doe.com';
        const userWithNewEmail = {
          ...userStub,
          email: newEmail,
        };

        await repository.create(userStub);
        await repository.update(userWithNewEmail);

        const userById = await repository.findById(userStub.id);
        assert.deepStrictEqual(userById, userWithNewEmail);
        const userByEmail = await repository.findByEmail(newEmail);
        assert.deepStrictEqual(userByEmail, userWithNewEmail);
      });
    });

    describe('delete', () => {
      it('deletes user', async () => {
        await repository.create(userStub);

        await repository.delete(userStub.id);

        const userById = await repository.findById(userStub.id);
        assert.equal(userById, null);
      });
    });
  });
};
