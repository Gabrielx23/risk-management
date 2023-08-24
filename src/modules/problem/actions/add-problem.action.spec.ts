import assert from 'assert';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import {
  idGeneratorStub,
  idGeneratorUuidStub,
} from '../../../shared/tests/stubs/id-generator.stub';
import { userViewStub } from '../../../shared/tests/stubs/models.stub';
import { ProblemRepository } from '../models/problem';
import { createProblemRepository } from '../repositories/repository.factory';
import { AddProblemAction, createAddProblemAction } from './add-problem.action';
import pick from 'lodash.pick';

describe('addProblem', () => {
  let repository: ProblemRepository;
  let addProblem: AddProblemAction;

  beforeEach(() => {
    repository = createProblemRepository({});
    addProblem = createAddProblemAction(
      repository,
      clockStub(),
      idGeneratorStub()
    );
  });

  it('properly creates problem', async () => {
    const input = {
      title: 'problem title',
      description: 'description',
      userId: userViewStub.id,
    };

    await addProblem(input);

    const addedProblem = await repository.findById(idGeneratorUuidStub);
    assert.deepStrictEqual(addedProblem, {
      ...pick(input, ['title', 'description']),
      createdBy: input.userId,
      id: idGeneratorUuidStub,
      result: null,
      createdAt: clockDateStub,
      updatedAt: clockDateStub,
      solvedAt: null,
    });
  });
});
