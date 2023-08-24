import { ProblemReadModel } from './problem.read-model';
import { RiskMetrics, Users } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { Paginated } from '../../../shared/paginated';
import { ProblemPaginationQuery } from '../models/input';
import { ProblemView } from '../models/output';
import { Problem, ProblemId, UserId } from '../models/problem';
import { Risk } from '../models/risk';

export const problemInMemoryReadModel = (
  inMemoryDb: InMemoryDb
): ProblemReadModel => {
  const problems = inMemoryDb.get('problems') as Map<ProblemId, Problem>;
  const riskMetrics = inMemoryDb.get('riskMetrics') as Map<string, RiskMetrics>;
  const users = inMemoryDb.get('users') as Map<string, Users>;

  return {
    async findByIdForUser(
      id: ProblemId,
      userId: UserId
    ): Promise<ProblemView | null> {
      const problem = problems.get(id);
      if (!problem || problem.createdBy !== userId) {
        return null;
      }

      const metrics = Array.from(riskMetrics.values()).filter(
        (metric: RiskMetrics) => metric.problemId
      );

      return ProblemView.parse({
        ...problem,
        createdBy: users.get(problem.createdBy),
        designatedUsers: [users.get(problem.createdBy)],
        risk: Risk(metrics.length ? metrics[metrics.length - 1] : null),
      });
    },

    async findMany({
      page,
      limit,
      search,
      userId,
    }: ProblemPaginationQuery): Promise<Paginated<ProblemView>> {
      const items: ProblemView[] = [];
      search = search?.toLowerCase();

      problems.forEach((item: Problem) => {
        if (
          (!search ||
            item.title.toLowerCase().includes(search) ||
            item.description?.toLowerCase().includes(search)) &&
          item.createdBy == userId
        ) {
          const metrics = Array.from(riskMetrics.values()).filter(
            (metric: RiskMetrics) => metric.problemId === item.id
          );

          items.push(
            ProblemView.parse({
              ...item,
              createdBy: users.get(item.createdBy),
              designatedUsers: [users.get(item.createdBy)],
              risk: Risk(metrics.length ? metrics[metrics.length - 1] : null),
            })
          );
        }
      });

      return Paginated.parse<ProblemView>({
        items: items.slice((page - 1) * limit, Math.max(1, page * limit - 1)),
        page,
        limit,
        totalItemsCount: problems.size,
      });
    },
  };
};
