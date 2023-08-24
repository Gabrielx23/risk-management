import { Kysely } from 'kysely';

import { riskMetricInMemoryRepository } from './risk-metric-in-memory.repository';
import { riskMetricSqlRepository } from './risk-metric-sql.repository';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import {
  RiskMetric,
  RiskMetricId,
  RiskMetricRepository,
} from '../models/risk-metric';

export const createRiskMetricRepository = ({
  db,
  inMemoryDb,
}: {
  inMemoryDb?: InMemoryDb | null;
  db?: Kysely<DB> | null;
}): RiskMetricRepository => {
  return db
    ? riskMetricSqlRepository(db)
    : riskMetricInMemoryRepository(
        inMemoryDb
          ? (inMemoryDb.get('riskMetrics') as Map<RiskMetricId, RiskMetric>)
          : new Map([])
      );
};
