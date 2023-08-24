import { RiskMetricReadModel } from './risk-metric.read-model';
import { Users } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { Paginated } from '../../../shared/paginated';
import { RiskMetricPaginationQuery } from '../models/input';
import { RiskMetricView } from '../models/output';
import { RiskMetric, RiskMetricId } from '../models/risk-metric';

export const riskMetricInMemoryReadModel = (
  inMemoryDb: InMemoryDb
): RiskMetricReadModel => {
  const riskMetrics = inMemoryDb.get('riskMetrics') as Map<
    RiskMetricId,
    RiskMetric
  >;
  const users = inMemoryDb.get('users') as Map<string, Users>;

  return {
    async findMany({
      page,
      limit,
      problemId,
    }: RiskMetricPaginationQuery): Promise<Paginated<RiskMetricView>> {
      const items: RiskMetric[] = [];
      riskMetrics.forEach((riskMetric: RiskMetric) => {
        if (riskMetric.problemId === problemId) {
          items.push(riskMetric);
        }
      });

      return Paginated.parse<RiskMetricView>({
        items: items
          .map((item: RiskMetric) =>
            RiskMetricView.parse({
              ...item,
              createdBy: users.get(item.createdBy),
            })
          )
          .slice((page - 1) * limit, Math.max(1, page * limit - 1)),
        page,
        limit,
        totalItemsCount: riskMetrics.size,
      });
    },
  };
};
