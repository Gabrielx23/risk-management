import assert from 'assert';
import { riskMetricStub } from '../../../shared/tests/stubs/models.stub';
import { RiskMetricReadModel } from './risk-metric.read-model';
import { RiskMetric } from '../models/risk-metric';

export const riskMetricReadModelContractTest = (
  variant: string,
  createReadModel: (recordsToAdd: RiskMetric[]) => Promise<RiskMetricReadModel>,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`Risk metric read model contract: ${variant}`, () => {
    let readModel: RiskMetricReadModel;

    beforeEach(async () => {
      await clean();
      await prepare();
      readModel = await createReadModel([
        riskMetricStub,
        {
          ...riskMetricStub,
          id: '200db642-a014-46dc-b678-fc2777b4b302',
        },
        {
          ...riskMetricStub,
          id: '200db642-a014-46dc-b678-fc2777b4b303',
          problemId: '200db642-a014-46dc-b678-fc2777b4b302',
        },
      ]);
    });

    describe('findMany', () => {
      it('considers limit', async () => {
        const result = await readModel.findMany({
          limit: 1,
          page: 1,
          sortDirection: 'asc',
          problemId: riskMetricStub.problemId,
        });
        assert.equal(result.items.length, 1);
      });

      it('considers problem id value', async () => {
        const result = await readModel.findMany({
          limit: 10,
          page: 1,
          sortDirection: 'asc',
          problemId: riskMetricStub.problemId,
        });

        assert.equal(result.items.length, 2);
      });
    });
  });
};
