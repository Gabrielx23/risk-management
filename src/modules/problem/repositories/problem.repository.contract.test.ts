import assert from 'assert';
import { ProblemRepository } from '../models/problem';
import { problemStub } from '../../../shared/tests/stubs/models.stub';

export const problemRepositoryContractTest = (
  variant: string,
  createRepository: () => ProblemRepository,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`Problem repository contract: ${variant}`, () => {
    let repository: ProblemRepository;

    beforeEach(async () => {
      await clean();
      await prepare();
      repository = createRepository();
    });

    describe('create', () => {
      it('creates problem', async () => {
        await repository.create(problemStub);

        const problem = await repository.findById(problemStub.id);
        assert.deepStrictEqual(problem, problemStub);
      });
    });

    describe('deletes', () => {
      it('deletes problem', async () => {
        await repository.create(problemStub);
        await repository.delete(problemStub.id);

        const problem = await repository.findById(problemStub.id);
        assert.equal(problem, null);
      });
    });

    describe('update', () => {
      it('updates problem', async () => {
        const updatedProblem = {
          ...problemStub,
          title: 'new title',
          description: 'some description',
          updatedAt: new Date('2023'),
          solvedAt: new Date('2023'),
          result: 1,
        };

        await repository.create(problemStub);
        await repository.update(updatedProblem);

        const problem = await repository.findById(problemStub.id);
        assert.deepStrictEqual(problem, updatedProblem);
      });
    });
  });
};
