import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { OtpReadModel } from '../../otp/read-models/otp.read-model';
import { ResetPasswordInput } from '../models/input';
import { UserRepository } from '../models/user';

export type ResetPasswordAction = (input: ResetPasswordInput) => Promise<void>;

export const createResetPasswordAction =
  (
    userRepository: UserRepository,
    otpReadModel: OtpReadModel,
    eventEmitter: EventEmitter
  ): ResetPasswordAction =>
  async ({ email }: ResetPasswordInput) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const otp = await otpReadModel.findOne({
      userId: user.id,
      purpose: OtpPurpose.passwordReset,
    });
    if (otp && !otp.canBeRegenerated) {
      throw new UnprocessableEntityError(
        'It is not possible to generate another password reset code so quickly.'
      );
    }

    eventEmitter.emit(EventName.userPasswordResetRequested, {
      userId: user.id,
    });
  };
