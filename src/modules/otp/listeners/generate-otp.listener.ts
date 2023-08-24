import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { AppEventListenerName } from '../../../shared/events/event-listener';
import { EventName } from '../../../shared/events/event-name.enum';
import { Logger } from '../../../shared/logger';
import { GenerateOtpAction } from '../actions/generate-otp.action';
import { GenerateOtpInput } from '../models/input';

export const listenToGenerateOtp = (
  eventEmitter: EventEmitter,
  generateOtp: GenerateOtpAction,
  logger: Logger
): AppEventListenerName => {
  const listenerName = Symbol('otp:listenToGenerateOtp');

  const handle = async (
    eventName: EventName,
    userId: string,
    purpose: OtpPurpose
  ): Promise<void> => {
    const parsingResult = GenerateOtpInput.safeParse({
      userId,
      purpose,
    });

    if (!parsingResult.success) {
      logger.error(
        `${eventName} has not been handled by ${listenerName.description} due to incorrect payload.`
      );
      logger.debug(JSON.stringify(parsingResult.error));

      return;
    }

    await generateOtp(parsingResult.data);
  };

  eventEmitter.on(
    EventName.userPasswordResetRequested,
    async ({ userId }: { userId: string }) => {
      await handle(
        EventName.userPasswordResetRequested,
        userId,
        OtpPurpose.passwordReset
      );
    }
  );

  eventEmitter.on(
    EventName.userActivationRequested,
    async ({ userId }: { userId: string }) => {
      await handle(
        EventName.userActivationRequested,
        userId,
        OtpPurpose.accountActivation
      );
    }
  );

  return listenerName;
};
