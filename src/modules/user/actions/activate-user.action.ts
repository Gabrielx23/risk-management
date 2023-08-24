import { Clock } from '../../../shared/clock';
import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { Role } from '../../../shared/enum/role.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { OtpReadModel } from '../../otp/read-models/otp.read-model';
import { ActivateUserInput } from '../models/input';
import { UserRepository } from '../models/user';

export type ActivateUserAction = (input: ActivateUserInput) => Promise<void>;

export const createActivateUserAction =
  (
    userRepository: UserRepository,
    otpReadModel: OtpReadModel,
    eventEmitter: EventEmitter,
    now: Clock
  ): ActivateUserAction =>
  async ({ email, otp: activationCode }: ActivateUserInput) => {
    const error = new UnprocessableEntityError('Activation code is incorrect.');
    const user = await userRepository.findByEmail(email);
    if (!user || user.role !== Role.notActive) {
      throw error;
    }

    const otp = await otpReadModel.findOne({
      userId: user.id,
      purpose: OtpPurpose.accountActivation,
      otp: activationCode,
    });
    if (!otp || otp.isExpired) {
      throw error;
    }

    await userRepository.update({
      ...user,
      role: Role.user,
      updatedAt: now(),
    });

    eventEmitter.emit(EventName.otpUsed, { id: otp.id });
    eventEmitter.emit(EventName.userActivated, { id: user.id });
  };
