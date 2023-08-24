import { Kysely, sql } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { ProblemReadModel } from './problem.read-model';
import { DB } from '../../../db/types';
import { getTotalItemsCount } from '../../../shared/helpers/db';
import { Paginated } from '../../../shared/paginated';
import { ProblemPaginationQuery } from '../models/input';
import { ProblemView } from '../models/output';
import { Problem, ProblemId, UserId } from '../models/problem';
import { Risk } from '../models/risk';

export const problemSqlReadModel = (db: Kysely<DB>): ProblemReadModel => {
  const baseQuery = db
    .selectFrom('problems')
    .selectAll()
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select(['users.id', 'users.name'])
          .whereRef('users.id', '=', 'problems.createdBy')
      ).as('createdBy'),
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('riskMetrics')
          .select(['riskMetrics.impact', 'riskMetrics.likelihood'])
          .whereRef('riskMetrics.problemId', '=', 'problems.id')
          .orderBy('riskMetrics.createdAt', 'desc')
          .limit(1)
      ).as('risk'),
    ]);

  return {
    async findByIdForUser(
      id: ProblemId,
      userId: UserId
    ): Promise<ProblemView | null> {
      const problem = await baseQuery
        .where('problems.id', '=', id)
        .where('problems.createdBy', '=', userId)
        .executeTakeFirst();

      return problem
        ? ProblemView.parse({
            ...problem,
            designatedUsers: [problem.createdBy],
            risk: Risk(problem.risk),
          })
        : null;
    },
    async findMany({
      page,
      limit,
      sortBy,
      sortDirection,
      search,
      userId,
    }: ProblemPaginationQuery): Promise<Paginated<ProblemView>> {
      const searchValue = `%${search ?? ''}%`;

      const items = (await baseQuery
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy(sortBy ?? 'problems.createdAt', sortDirection)
        .where('problems.createdBy', '=', userId)
        .where((eb) =>
          eb.or([
            eb('problems.title', 'ilike', searchValue),
            eb('problems.description', 'ilike', searchValue),
          ])
        )
        .execute()) as unknown as (Problem & {
        risk: Pick<Risk, 'likelihood' | 'impact'>;
      })[];

      const countResult = await db
        .selectFrom('problems')
        .select<any>([sql`count(*) as count`])
        .where('problems.createdBy', '=', userId)
        .where((eb) =>
          eb.or([
            eb('problems.title', 'ilike', searchValue),
            eb('problems.description', 'ilike', searchValue),
          ])
        )
        .execute();

      return Paginated.parse<ProblemView>({
        items: items.map(
          (item: Problem & { risk: Pick<Risk, 'likelihood' | 'impact'> }) =>
            ProblemView.parse({
              ...item,
              designatedUsers: [item.createdBy],
              risk: Risk(item.risk),
            })
        ),
        page,
        limit,
        totalItemsCount: getTotalItemsCount(countResult),
      });
    },
  };
};
