import { Clock } from '../../../shared/clock';
import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { Randomizer } from '../../../shared/randomizer';
import { IdGenerator } from '../../../shared/uuid';
import { OTP_TTL } from '../defaults';
import { GenerateOtpInput } from '../models/input';
import { OtpRepository, UserId } from '../models/otp';
import { OtpView } from '../models/output';

export type GenerateOtpAction = (input: GenerateOtpInput) => Promise<void>;

export const createGenerateOtpAction = (
  otpRepository: OtpRepository,
  randomizer: Randomizer,
  eventEmitter: EventEmitter,
  clock: Clock,
  idGenerator: IdGenerator
): GenerateOtpAction => {
  const handleExistingOtp = async (
    userId: UserId,
    purpose: OtpPurpose
  ): Promise<boolean> => {
    const otp = await otpRepository.findOne({ userId, purpose });
    if (!otp) {
      return true;
    }

    if (!OtpView.parse(otp, clock).canBeRegenerated) {
      return false;
    }

    await otpRepository.delete(otp.id);

    return true;
  };

  return async ({ userId, purpose }: GenerateOtpInput): Promise<void> => {
    const now = clock();
    const currentTime = now.getTime();

    if (!(await handleExistingOtp(userId, purpose))) {
      return;
    }

    const otpValue = randomizer.randomString(6);
    await otpRepository.create({
      id: idGenerator(),
      otp: otpValue,
      userId,
      purpose,
      createdAt: now,
      expiresAt: new Date(currentTime + OTP_TTL * 1000),
    });

    eventEmitter.emit(EventName.otpGenerated, {
      userId,
      purpose,
      otp: otpValue,
    });
  };
};
