import { z } from 'zod';

import { PaginationQueryParseRules } from '../../../shared/paginated';
import { Uuid } from '../../../shared/uuid';
import { MAX_METRIC_VALUE } from '../defaults';

const metric = z.number().int().min(0).max(MAX_METRIC_VALUE);
export const AddRiskMetricInput = z.object({
  comment: z.string().min(3).max(250),
  likelihood: metric,
  impact: metric,
  problemId: Uuid,
  createdBy: Uuid,
});
export type AddRiskMetricInput = z.infer<typeof AddRiskMetricInput>;

export const RiskMetricPaginationQuery = PaginationQueryParseRules([
  'riskMetrics.createdAt',
]).extend({
  problemId: Uuid,
});
export type RiskMetricPaginationQuery = z.infer<
  typeof RiskMetricPaginationQuery & { sortBy: 'riskMetrics.createdAt' }
>;
