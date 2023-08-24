import { userStub } from '../../../shared/tests/stubs/models.stub';
import { RiskMetric, RiskMetricId } from '../models/risk-metric';
import { riskMetricInMemoryReadModel } from './risk-metric-in-memory.read-model';
import { riskMetricReadModelContractTest } from './risk-metric.read-model.contract.test';

riskMetricReadModelContractTest(
  'in-memory',
  async (recordsToAdd: RiskMetric[]) => {
    return riskMetricInMemoryReadModel(
      new Map<string, Map<string, any>>([
        [
          'riskMetrics',
          new Map(
            recordsToAdd.map((record: RiskMetric) => [record.id, record])
          ),
        ],
        ['users', new Map([[userStub.id, userStub]])],
      ])
    );
  },
  async () => {},
  async () => {}
);
