import { InMemoryDb } from '../../../shared/in-memory.db';
import { Problem, ProblemId, ProblemRepository } from '../models/problem';

export const problemInMemoryRepository = (
  inMemoryDb: InMemoryDb
): ProblemRepository => {
  const problems = inMemoryDb.get('problems') as Map<ProblemId, Problem>;

  return {
    async findById(id: ProblemId): Promise<Problem | null> {
      const problem = problems.get(id);

      return problem ?? null;
    },
    async update(problem: Problem): Promise<void> {
      problems.set(problem.id, problem);
    },
    async delete(id: ProblemId): Promise<void> {
      problems.delete(id);
    },
    async create(problem: Problem): Promise<void> {
      problems.set(problem.id, problem);
    },
  };
};
