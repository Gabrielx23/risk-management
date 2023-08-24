import {
  RiskMetric,
  RiskMetricId,
  RiskMetricRepository,
} from '../models/risk-metric';

export const riskMetricInMemoryRepository = (
  riskMetrics: Map<RiskMetricId, RiskMetric>
): RiskMetricRepository => ({
  async findById(id: RiskMetricId): Promise<RiskMetric | null> {
    return riskMetrics.get(id) ?? null;
  },

  async create(riskMetric: RiskMetric): Promise<void> {
    riskMetrics.set(riskMetric.id, riskMetric);
  },
});
