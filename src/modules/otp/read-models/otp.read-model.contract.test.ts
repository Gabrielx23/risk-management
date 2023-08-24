import assert from 'assert';
import { OtpReadModel } from './otp.read-model';
import { OtpRepository } from '../models/otp';
import { otpStub, otpViewStub } from '../../../shared/tests/stubs/models.stub';
import pick from 'lodash.pick';

export const otpReadModelContractTest = (
  variant: string,
  createReadModel: () => OtpReadModel,
  clean: () => Promise<void>,
  prepare: () => Promise<void>,
  repository: OtpRepository
) => {
  describe(`Otp read model contract: ${variant}`, () => {
    let readModel: OtpReadModel;

    beforeEach(async () => {
      await clean();
      await prepare();
      readModel = createReadModel();
    });

    describe('findOne', () => {
      const findOneCriteria = pick(otpViewStub, ['purpose', 'userId', 'otp']);

      it('returns null if otp does not exist', async () => {
        const result = await readModel.findOne(findOneCriteria);

        assert.equal(result, null);
      });

      it('returns otp view if it exists', async () => {
        await repository.create(otpStub);

        const result = await readModel.findOne(findOneCriteria);

        assert.deepStrictEqual(result, otpViewStub);
      });
    });
  });
};
