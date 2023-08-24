import { NotFoundError } from '../../../shared/errors';
import { DeleteProblemInput } from '../models/input';
import { ProblemRepository } from '../models/problem';

export type DeleteProblemAction = (input: DeleteProblemInput) => Promise<void>;

export const createDeleteProblemAction =
  (repository: ProblemRepository): DeleteProblemAction =>
  async ({ problemId, userId }: DeleteProblemInput): Promise<void> => {
    const problem = await repository.findById(problemId);
    if (!problem || problem.createdBy !== userId) {
      throw new NotFoundError('Selected problem does not exist.');
    }

    await repository.delete(problemId);
  };
