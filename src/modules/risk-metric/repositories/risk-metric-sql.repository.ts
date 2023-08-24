import { Kysely } from 'kysely';

import { DB } from '../../../db/types';
import {
  RiskMetric,
  RiskMetricId,
  RiskMetricRepository,
} from '../models/risk-metric';

export const riskMetricSqlRepository = (
  db: Kysely<DB>
): RiskMetricRepository => ({
  async findById(id: RiskMetricId): Promise<RiskMetric | null> {
    const riskMetric = await db
      .selectFrom('riskMetrics')
      .selectAll()
      .where('riskMetrics.id', '=', id)
      .executeTakeFirst();

    return (riskMetric as RiskMetric) ?? null;
  },
  async create(riskMetric: RiskMetric): Promise<void> {
    await db.insertInto('riskMetrics').values(riskMetric).execute();
  },
});
