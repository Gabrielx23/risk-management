import { Clock } from '../../../shared/clock';
import { IdGenerator } from '../../../shared/uuid';
import { AddProblemInput } from '../models/input';
import { ProblemRepository } from '../models/problem';

export type AddProblemAction = (input: AddProblemInput) => Promise<void>;

export const createAddProblemAction =
  (
    repository: ProblemRepository,
    clock: Clock,
    idGenerator: IdGenerator
  ): AddProblemAction =>
  async ({ title, description, userId }: AddProblemInput): Promise<void> => {
    const now = clock();

    await repository.create({
      title,
      description,
      createdBy: userId,
      id: idGenerator(),
      result: null,
      createdAt: now,
      updatedAt: now,
      solvedAt: null,
    });
  };
