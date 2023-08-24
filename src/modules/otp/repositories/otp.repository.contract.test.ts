import assert from 'assert';
import { OtpRepository } from '../models/otp';
import pick from 'lodash.pick';
import { otpStub } from '../../../shared/tests/stubs/models.stub';

export const otpRepositoryContractTest = (
  variant: string,
  createRepository: () => OtpRepository,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`Otp repository contract: ${variant}`, () => {
    let repository: OtpRepository;

    beforeEach(async () => {
      await clean();
      await prepare();
      repository = createRepository();
    });

    describe('create', () => {
      it('creates otp', async () => {
        await repository.create(otpStub);

        const otpFoundByCriteria = await repository.findOne(
          pick(otpStub, ['purpose', 'userId', 'otp'])
        );
        assert.deepStrictEqual(otpFoundByCriteria, otpStub);
        const otpFoundById = await repository.findById(otpStub.id);
        assert.deepStrictEqual(otpFoundById, otpStub);
      });
    });

    describe('delete', () => {
      it('deletes otp', async () => {
        await repository.create(otpStub);
        await repository.delete(otpStub.id);

        const otpFoundByCriteria = await repository.findOne(
          pick(otpStub, ['purpose', 'userId', 'otp'])
        );
        assert.equal(otpFoundByCriteria, null);
        const otpFoundById = await repository.findById(otpStub.id);
        assert.equal(otpFoundById, null);
      });
    });
  });
};
