import { Clock } from '../../../shared/clock';
import { NotFoundError } from '../../../shared/errors';
import { UpdateProblemInput } from '../models/input';
import { ProblemRepository } from '../models/problem';

export type UpdateProblemAction = (input: UpdateProblemInput) => Promise<void>;

export const createUpdateProblemAction =
  (repository: ProblemRepository, clock: Clock): UpdateProblemAction =>
  async ({
    problemId,
    userId,
    result,
    ...data
  }: UpdateProblemInput): Promise<void> => {
    const problem = await repository.findById(problemId);
    if (!problem || problem.createdBy !== userId) {
      throw new NotFoundError('Selected problem does not exist.');
    }

    const now = clock();
    const solvedAt = result
      ? result === problem.result
        ? problem.solvedAt
        : now
      : null;

    await repository.update({
      ...problem,
      ...data,
      result,
      updatedAt: now,
      solvedAt,
    });
  };
