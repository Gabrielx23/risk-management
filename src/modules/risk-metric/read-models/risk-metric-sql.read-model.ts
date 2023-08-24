import { Kysely, sql } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { RiskMetricReadModel } from './risk-metric.read-model';
import { DB } from '../../../db/types';
import { getTotalItemsCount } from '../../../shared/helpers/db';
import { Paginated } from '../../../shared/paginated';
import { RiskMetricPaginationQuery } from '../models/input';
import { RiskMetricView } from '../models/output';
import { RiskMetric } from '../models/risk-metric';

export const riskMetricSqlReadModel = (
  db: Kysely<DB>
): RiskMetricReadModel => ({
  async findMany({
    page,
    limit,
    sortBy,
    sortDirection,
    problemId,
  }: RiskMetricPaginationQuery): Promise<Paginated<RiskMetricView>> {
    const items = await db
      .selectFrom('riskMetrics')
      .selectAll('riskMetrics')
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .select(['users.id', 'users.name'])
            .whereRef('users.id', '=', 'riskMetrics.createdBy')
        ).as('createdBy'),
      ])
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(
        (sortBy as 'riskMetrics.createdAt') ?? 'riskMetrics.createdAt',
        sortDirection
      )
      .where('riskMetrics.problemId', '=', problemId)
      .execute();

    const countResult = await db
      .selectFrom('riskMetrics')
      .select<any>([sql`count(*) as count`])
      .where('riskMetrics.problemId', '=', problemId)
      .execute();

    return Paginated.parse<RiskMetricView>({
      items: items.map((item: RiskMetric) => RiskMetricView.parse(item)),
      page,
      limit,
      totalItemsCount: getTotalItemsCount(countResult),
    });
  },
});
