import assert from 'assert';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import {
  idGeneratorStub,
  idGeneratorUuidStub,
} from '../../../shared/tests/stubs/id-generator.stub';
import { problemReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { RiskMetricRepository } from '../models/risk-metric';
import { createRiskMetricRepository } from '../repositories/repository.factory';
import {
  AddRiskMetricAction,
  createAddRiskMetricAction,
} from './add-risk-metric.action';
import { AddRiskMetricInput } from '../models/input';
import {
  problemViewStub,
  riskMetricStub,
} from '../../../shared/tests/stubs/models.stub';
import {
  NotFoundError,
  UnprocessableEntityError,
} from '../../../shared/errors';

describe('addRiskMetric', () => {
  const input: AddRiskMetricInput = {
    comment: 'some comment',
    likelihood: 10,
    impact: 10,
    problemId: problemViewStub.id,
    createdBy: riskMetricStub.createdBy,
  };
  let repository: RiskMetricRepository;
  let addRiskMetric: AddRiskMetricAction;

  beforeEach(() => {
    repository = createRiskMetricRepository({});
    addRiskMetric = createAddRiskMetricAction(
      repository,
      problemReadModelStub(),
      idGeneratorStub(),
      clockStub()
    );
  });

  it('throws an error if problem does not exist', async () => {
    addRiskMetric = createAddRiskMetricAction(
      repository,
      problemReadModelStub(null),
      idGeneratorStub(),
      clockStub()
    );

    await assert.rejects(
      addRiskMetric(input),
      new NotFoundError('Selected problem does not exist.')
    );
  });

  it('throws an error if problem is solved', async () => {
    addRiskMetric = createAddRiskMetricAction(
      repository,
      problemReadModelStub({
        ...problemViewStub,
        solvedAt: new Date('2023-08-02T00:00:00.000Z'),
      }),
      idGeneratorStub(),
      clockStub()
    );

    await assert.rejects(
      addRiskMetric(input),
      new UnprocessableEntityError(
        'Cannot add risk metric, because selected problem is solved.'
      )
    );
  });

  it('creates new risk metric', async () => {
    await addRiskMetric(input);

    const riskMetric = await repository.findById(idGeneratorUuidStub);
    assert.deepStrictEqual(riskMetric, {
      ...input,
      id: idGeneratorUuidStub,
      createdAt: clockDateStub,
    });
  });
});
