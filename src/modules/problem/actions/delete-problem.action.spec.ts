import assert from 'assert';
import { problemStub } from '../../../shared/tests/stubs/models.stub';
import { ProblemRepository } from '../models/problem';
import { createProblemRepository } from '../repositories/repository.factory';
import {
  DeleteProblemAction,
  createDeleteProblemAction,
} from './delete-problem.action';
import { NotFoundError } from '../../../shared/errors';

describe('deleteProblem', () => {
  let repository: ProblemRepository;
  let deleteProblem: DeleteProblemAction;

  beforeEach(() => {
    repository = createProblemRepository({});
    deleteProblem = createDeleteProblemAction(repository);
  });

  it('throws an error if problem does not exist', async () => {
    await assert.rejects(
      deleteProblem({
        problemId: 'does-not-exist',
        userId: problemStub.createdBy,
      }),
      new NotFoundError('Selected problem does not exist.')
    );
  });

  it('throws an error if user is not the creator', async () => {
    await repository.create(problemStub);

    await assert.rejects(
      deleteProblem({
        problemId: problemStub.id,
        userId: 'different-user',
      }),
      new NotFoundError('Selected problem does not exist.')
    );
  });

  it('properly deletes selected problem', async () => {
    await repository.create(problemStub);

    await deleteProblem({
      problemId: problemStub.id,
      userId: problemStub.createdBy,
    });

    const deletedProblem = await repository.findById(problemStub.id);
    assert.equal(deletedProblem, null);
  });
});
