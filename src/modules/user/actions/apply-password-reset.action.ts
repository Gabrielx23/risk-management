import { Clock } from '../../../shared/clock';
import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { Hasher } from '../../../shared/hasher';
import { OtpReadModel } from '../../otp/read-models/otp.read-model';
import { ApplyPasswordResetInput } from '../models/input';
import { UserRepository } from '../models/user';

export type ApplyPasswordResetAction = (
  input: Omit<ApplyPasswordResetInput, 'passwordConfirmation'>
) => Promise<void>;

export const createApplyPasswordResetAction =
  (
    userRepository: UserRepository,
    otpReadModel: OtpReadModel,
    eventEmitter: EventEmitter,
    hasher: Hasher,
    now: Clock
  ): ApplyPasswordResetAction =>
  async ({
    email,
    password,
    otp: activationCode,
  }: Omit<ApplyPasswordResetInput, 'passwordConfirmation'>) => {
    const error = new UnprocessableEntityError(
      'Confirmation code is incorrect.'
    );
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw error;
    }

    const otp = await otpReadModel.findOne({
      userId: user.id,
      purpose: OtpPurpose.passwordReset,
      otp: activationCode,
    });
    if (!otp || otp.isExpired) {
      throw error;
    }

    await userRepository.update({
      ...user,
      password: hasher.hash(password),
      updatedAt: now(),
    });

    eventEmitter.emit(EventName.otpUsed, { id: otp.id });
    eventEmitter.emit(EventName.userPasswordChanged, { userId: user.id });
  };
