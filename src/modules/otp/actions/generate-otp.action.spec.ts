import pick from 'lodash.pick';
import { otpStub } from '../../../shared/tests/stubs/models.stub';
import { OtpRepository } from '../models/otp';
import {
  GenerateOtpAction,
  createGenerateOtpAction,
} from './generate-otp.action';
import { createOtpRepository } from '../repositories/repository.factory';
import {
  randomizerStringStub,
  randomizerStub,
} from '../../../shared/tests/stubs/randomizer.stub';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import {
  idGeneratorStub,
  idGeneratorUuidStub,
} from '../../../shared/tests/stubs/id-generator.stub';
import assert from 'assert';
import { OTP_TTL } from '../defaults';

describe('generateOtp', () => {
  let repository: OtpRepository;
  let generateOtp: GenerateOtpAction;

  const input = pick(otpStub, ['userId', 'purpose']);

  beforeEach(() => {
    repository = createOtpRepository({});
    generateOtp = createGenerateOtpAction(
      repository,
      randomizerStub(),
      eventEmitterDummy,
      clockStub(),
      idGeneratorStub()
    );
  });

  it('will not generate otp if there is existing, not regenerative one', async () => {
    await repository.create(otpStub);

    await generateOtp(input);

    const otp = await repository.findOne(input);
    assert.deepStrictEqual(otp, otpStub);
  });

  it('removes previous otp if it was regenerative and generates new one', async () => {
    const existingOtpId = '200db642-a014-46dc-b678-fc2777b4b302';

    await repository.create({
      ...otpStub,
      id: existingOtpId,
      createdAt: new Date('2023-08-01T00:00:00.000Z'),
      expiresAt: new Date('2023-08-03T00:00:00.000Z'),
    });
    await generateOtp(input);

    const existingOtp = await repository.findById(existingOtpId);
    assert.equal(existingOtp, null);
    const newlyCreatedOtp = await repository.findById(idGeneratorUuidStub);
    assert.deepStrictEqual(newlyCreatedOtp, {
      ...input,
      id: idGeneratorUuidStub,
      otp: randomizerStringStub,
      createdAt: clockDateStub,
      expiresAt: new Date(clockDateStub.getTime() + OTP_TTL * 1000),
    });
  });

  it('generates otp if there is no existing otp', async () => {
    await generateOtp(input);

    const newlyCreatedOtp = await repository.findById(idGeneratorUuidStub);
    assert.deepStrictEqual(newlyCreatedOtp, {
      ...input,
      id: idGeneratorUuidStub,
      otp: randomizerStringStub,
      createdAt: clockDateStub,
      expiresAt: new Date(clockDateStub.getTime() + OTP_TTL * 1000),
    });
  });
});
