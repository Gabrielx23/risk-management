import { UserRepository, User } from '../models/user';
import assert from 'assert';
import {
  userStub,
  userViewStub,
} from '../../../shared/tests/stubs/models.stub';
import { UserReadModel } from './user.read-model';
import { createHasher } from '../../../app/factories/hasher.factory';

export const userReadModelContractTest = (
  variant: string,
  createReadModel: () => UserReadModel,
  clean: () => Promise<void>,
  repository: UserRepository
) => {
  describe(`User read model contract: ${variant}`, () => {
    const password = 'somepassword';
    const hashedPassword = createHasher().hash(password);
    let readModel: UserReadModel;

    beforeEach(async () => {
      await clean();
      readModel = createReadModel();
    });

    describe('findById', () => {
      it('returns null if user by id does not exist', async () => {
        const result = await readModel.findById(userViewStub.id);

        assert.equal(result, null);
      });

      it('returns user view if it exists by id', async () => {
        await repository.create(userStub);

        const result = await readModel.findById(userViewStub.id);

        assert.deepStrictEqual(result, userViewStub);
      });
    });

    describe('findValid', () => {
      it('returns null if user by email does not exist', async () => {
        const result = await readModel.findValid(
          userViewStub.email,
          hashedPassword
        );

        assert.equal(result, null);
      });

      it('returns null if passwords do not match', async () => {
        await repository.create(userStub);

        const result = await readModel.findValid(
          userViewStub.email,
          'wrongpassword'
        );

        assert.equal(result, null);
      });

      it('returns user view if it exists by email and it is valid', async () => {
        await repository.create({ ...userStub, password: hashedPassword });

        const result = await readModel.findValid(userStub.email, password);

        assert.deepStrictEqual(result, userViewStub);
      });
    });

    describe('findMany', () => {
      it('considers limit', async () => {
        await repository.create(userStub);
        await repository.create({
          ...userStub,
          email: 'diff@email.pl',
          id: '200db642-a014-46dc-b678-fc2777b4b302',
        });

        const result = await repository.findMany({
          limit: 1,
          page: 1,
          sortDirection: 'asc',
        });

        assert.equal(result.items.length, 1);
      });

      it('considers search value', async () => {
        await repository.create(userStub);
        await repository.create({
          ...userStub,
          email: 'diff@email.pl',
          id: '200db642-a014-46dc-b678-fc2777b4b302',
        });
        await repository.create({
          ...userStub,
          name: 'Random Name',
          email: 'diff2@email.pl',
          id: '200db642-a014-46dc-b678-fc2777b4b303',
        });

        const result = await repository.findMany({
          limit: 10,
          page: 1,
          sortDirection: 'asc',
          search: 'OHN',
        });

        assert.equal(result.items.length, 2);
      });
    });
  });
};
