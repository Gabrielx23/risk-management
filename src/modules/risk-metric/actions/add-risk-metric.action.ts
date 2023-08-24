import { Clock } from '../../../shared/clock';
import {
  NotFoundError,
  UnprocessableEntityError,
} from '../../../shared/errors';
import { IdGenerator } from '../../../shared/uuid';
import { ProblemReadModel } from '../../problem/read-models/problem.read-model';
import { AddRiskMetricInput } from '../models/input';
import { RiskMetricRepository } from '../models/risk-metric';

export type AddRiskMetricAction = (input: AddRiskMetricInput) => Promise<void>;

export const createAddRiskMetricAction = (
  repository: RiskMetricRepository,
  problemReadModel: ProblemReadModel,
  idGenerator: IdGenerator,
  clock: Clock
): AddRiskMetricAction => {
  return async ({
    problemId,
    createdBy,
    likelihood,
    impact,
    comment,
  }: AddRiskMetricInput): Promise<void> => {
    const problem = await problemReadModel.findByIdForUser(
      problemId,
      createdBy
    );

    if (!problem) {
      throw new NotFoundError('Selected problem does not exist.');
    }

    if (problem.solvedAt) {
      throw new UnprocessableEntityError(
        'Cannot add risk metric, because selected problem is solved.'
      );
    }

    await repository.create({
      id: idGenerator(),
      problemId,
      createdBy,
      likelihood,
      impact,
      comment,
      createdAt: clock(),
    });
  };
};
