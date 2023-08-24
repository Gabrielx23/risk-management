import {
  riskMetricStub,
  userStub,
} from '../../../shared/tests/stubs/models.stub';
import { Problem } from '../models/problem';
import { problemInMemoryReadModel } from './problem-in-memory.read-model';
import { problemReadModelContractTest } from './problem.read-model.contract.test';

problemReadModelContractTest(
  'in-memory',
  async (recordsToAdd: Problem[]) => {
    return problemInMemoryReadModel(
      new Map<string, Map<string, any>>([
        [
          'problems',
          new Map(recordsToAdd.map((record: Problem) => [record.id, record])),
        ],
        ['riskMetrics', new Map([[riskMetricStub.id, riskMetricStub]])],
        ['users', new Map([[userStub.id, userStub]])],
      ])
    );
  },
  async () => {},
  async () => {}
);
