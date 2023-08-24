import assert from 'assert';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import { problemStub } from '../../../shared/tests/stubs/models.stub';
import { ProblemRepository } from '../models/problem';
import { createProblemRepository } from '../repositories/repository.factory';
import {
  UpdateProblemAction,
  createUpdateProblemAction,
} from './update-problem.action';
import { NotFoundError } from '../../../shared/errors';
import { UpdateProblemInput } from '../models/input';
import pick from 'lodash.pick';

describe('updateProblem', () => {
  const input: UpdateProblemInput = {
    title: 'some new problem title',
    description: 'some new description',
    result: 5,
    userId: problemStub.createdBy,
    problemId: problemStub.id,
  };
  let repository: ProblemRepository;
  let updateProblem: UpdateProblemAction;

  beforeEach(() => {
    repository = createProblemRepository({});
    updateProblem = createUpdateProblemAction(repository, clockStub());
  });

  it('throws an error if problem does not exist', async () => {
    await assert.rejects(
      updateProblem({
        ...input,
        problemId: 'does-not-exist',
      }),
      new NotFoundError('Selected problem does not exist.')
    );
  });

  it('throws an error if user is not the creator', async () => {
    await repository.create(problemStub);

    await assert.rejects(
      updateProblem({
        ...input,
        userId: 'different-user',
      }),
      new NotFoundError('Selected problem does not exist.')
    );
  });

  it('properly updates solvedAt if result differs', async () => {
    await repository.create(problemStub);

    await updateProblem(input);

    const updatedProblem = await repository.findById(problemStub.id);
    assert.deepStrictEqual(updatedProblem, {
      ...problemStub,
      ...pick(input, ['title', 'description', 'result']),
      updatedAt: clockDateStub,
      solvedAt: clockDateStub,
    });
  });

  it('properly updates solvedAt if result is null', async () => {
    await repository.create(problemStub);

    await updateProblem({
      ...input,
      result: null,
    });

    const updatedProblem = await repository.findById(problemStub.id);
    assert.deepStrictEqual(updatedProblem, {
      ...problemStub,
      ...pick(input, ['title', 'description']),
      result: null,
      updatedAt: clockDateStub,
      solvedAt: null,
    });
  });
});
