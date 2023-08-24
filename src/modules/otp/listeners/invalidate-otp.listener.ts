import { EventEmitter } from '../../../shared/events/event-emitter';
import { AppEventListenerName } from '../../../shared/events/event-listener';
import { EventName } from '../../../shared/events/event-name.enum';
import { Logger } from '../../../shared/logger';
import { InvalidateOtpAction } from '../actions/invalidate-otp.action';
import { InvalidateOtpInput } from '../models/input';
import { OtpId } from '../models/otp';

export const listenToInvalidateOtp = (
  eventEmitter: EventEmitter,
  invalidateOtp: InvalidateOtpAction,
  logger: Logger
): AppEventListenerName => {
  const listenerName = Symbol('otp:listenToInvalidateOtp');

  eventEmitter.on(EventName.otpUsed, async ({ id }: { id: OtpId }) => {
    const parsingResult = InvalidateOtpInput.safeParse({
      id,
    });

    if (!parsingResult.success) {
      logger.error(
        `${
          EventName.otpUsed
        } has not been handled by ${listenerName.toString()} due to incorrect payload.`
      );
      logger.debug(JSON.stringify(parsingResult.error));

      return;
    }

    await invalidateOtp(parsingResult.data);
  });

  return listenerName;
};
