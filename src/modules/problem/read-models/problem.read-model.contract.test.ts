import assert from 'assert';
import {
  problemStub,
  riskMetricStub,
  userViewStub,
} from '../../../shared/tests/stubs/models.stub';
import { Problem } from '../models/problem';
import { ProblemReadModel } from './problem.read-model';
import pick from 'lodash.pick';
import { Risk } from '../models/risk';

export const problemReadModelContractTest = (
  variant: string,
  createReadModel: (recordsToAdd: Problem[]) => Promise<ProblemReadModel>,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`Problem read model contract: ${variant}`, () => {
    let readModel: ProblemReadModel;

    beforeEach(async () => {
      await clean();
      await prepare();
      readModel = await createReadModel([
        problemStub,
        {
          ...problemStub,
          id: '200db642-a014-46dc-b678-fc2777b4b302',
          title: 'searchable',
        },
        {
          ...problemStub,
          id: '200db642-a014-46dc-b678-fc2777b4b303',
          createdBy: '200db642-a014-46dc-b678-fc2777b4b302',
        },
      ]);
    });

    describe('findByIdForUser', () => {
      it('returns null if problem does not exist', async () => {
        const result = await readModel.findByIdForUser(
          '200db642-a014-46dc-b678-fc2777b4b308',
          problemStub.createdBy
        );

        assert.equal(result, null);
      });

      it('returns problem if it exists by id', async () => {
        const result = await readModel.findByIdForUser(
          problemStub.id,
          problemStub.createdBy
        );

        assert.deepStrictEqual(result, {
          ...problemStub,
          createdBy: pick(userViewStub, ['id', 'name']),
          designatedUsers: [pick(userViewStub, ['id', 'name'])],
          risk: Risk(riskMetricStub),
        });
      });
    });

    describe('findMany', () => {
      it('considers limit', async () => {
        const result = await readModel.findMany({
          limit: 1,
          page: 1,
          sortDirection: 'asc',
          userId: problemStub.createdBy,
        });
        assert.equal(result.items.length, 1);
      });

      it('considers user id value', async () => {
        const result = await readModel.findMany({
          limit: 10,
          page: 1,
          sortDirection: 'asc',
          userId: problemStub.createdBy,
        });

        assert.equal(result.items.length, 2);
      });

      it('considers search value', async () => {
        const result = await readModel.findMany({
          limit: 10,
          page: 1,
          sortDirection: 'asc',
          userId: problemStub.createdBy,
          search: 'search',
        });

        assert.equal(result.items.length, 1);
      });
    });
  });
};
