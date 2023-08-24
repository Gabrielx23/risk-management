import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { Role } from '../../../shared/enum/role.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { OtpReadModel } from '../../otp/read-models/otp.read-model';
import { GenerateActivationCodeInput } from '../models/input';
import { UserRepository } from '../models/user';

export type GenerateActivationCodeAction = (
  input: GenerateActivationCodeInput
) => Promise<void>;

export const createGenerateActivationCodeAction =
  (
    userRepository: UserRepository,
    otpReadModel: OtpReadModel,
    eventEmitter: EventEmitter
  ): GenerateActivationCodeAction =>
  async ({ email }: GenerateActivationCodeInput) => {
    const user = await userRepository.findByEmail(email);
    if (!user || user.role !== Role.notActive) {
      return;
    }

    const otp = await otpReadModel.findOne({
      userId: user.id,
      purpose: OtpPurpose.accountActivation,
    });
    if (otp && !otp.canBeRegenerated) {
      throw new UnprocessableEntityError(
        'It is not possible to generate another activation code so quickly.'
      );
    }

    eventEmitter.emit(EventName.userActivationRequested, { userId: user.id });
  };
