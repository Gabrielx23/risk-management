import { Kysely } from 'kysely';

import { riskMetricInMemoryReadModel } from './risk-metric-in-memory.read-model';
import { riskMetricSqlReadModel } from './risk-metric-sql.read-model';
import { RiskMetricReadModel } from './risk-metric.read-model';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';

export const createRiskMetricReadModel = ({
  db,
  inMemoryDb,
}: {
  inMemoryDb?: InMemoryDb | null;
  db?: Kysely<DB> | null;
}): RiskMetricReadModel => {
  return db
    ? riskMetricSqlReadModel(db)
    : riskMetricInMemoryReadModel(inMemoryDb ?? new Map([]));
};
