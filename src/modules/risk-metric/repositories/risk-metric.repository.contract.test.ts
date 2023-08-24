import assert from 'assert';
import { riskMetricStub } from '../../../shared/tests/stubs/models.stub';
import { RiskMetricRepository } from '../models/risk-metric';

export const riskMetricRepositoryContractTest = (
  variant: string,
  createRepository: () => RiskMetricRepository,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`Risk metric repository contract: ${variant}`, () => {
    let repository: RiskMetricRepository;

    beforeEach(async () => {
      await clean();
      await prepare();
      repository = createRepository();
    });

    describe('create', () => {
      it('creates risk metric', async () => {
        await repository.create(riskMetricStub);

        const riskMetric = await repository.findById(riskMetricStub.id);
        assert.deepStrictEqual(riskMetric, riskMetricStub);
      });
    });
  });
};
