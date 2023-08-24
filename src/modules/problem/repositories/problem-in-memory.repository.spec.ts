import { problemRepositoryContractTest } from './problem.repository.contract.test';
import { createProblemRepository } from './repository.factory';

problemRepositoryContractTest(
  'in-memory',
  () => {
    return createProblemRepository({});
  },
  async () => {},
  async () => {}
);
