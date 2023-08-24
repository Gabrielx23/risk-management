import pick from 'lodash.pick';

import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { InvalidateOtpInput } from '../models/input';
import { OtpRepository } from '../models/otp';

export type InvalidateOtpAction = (input: InvalidateOtpInput) => Promise<void>;

export const createInvalidateOtpAction =
  (
    otpRepository: OtpRepository,
    eventEmitter: EventEmitter
  ): InvalidateOtpAction =>
  async ({ id }: InvalidateOtpInput): Promise<void> => {
    const otp = await otpRepository.findById(id);
    if (!otp) {
      return;
    }

    await otpRepository.delete(id);

    eventEmitter.emit(
      EventName.otpInvalidated,
      pick(otp, ['purpose', 'userId'])
    );
  };
