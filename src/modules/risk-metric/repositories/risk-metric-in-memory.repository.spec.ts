import { createRiskMetricRepository } from './repository.factory';
import { riskMetricRepositoryContractTest } from './risk-metric.repository.contract.test';

riskMetricRepositoryContractTest(
  'in-memory',
  () => {
    return createRiskMetricRepository({});
  },
  async () => {},
  async () => {}
);
