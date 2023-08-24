import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { AppEventListenerName } from '../../../shared/events/event-listener';
import { EventName } from '../../../shared/events/event-name.enum';
import { Logger } from '../../../shared/logger';
import { SendMailAction } from '../actions/send-mail.action';
import { SendMailInput } from '../models/input';
import { MessageName } from '../models/message';

export const listenToSendMail = (
  eventEmitter: EventEmitter,
  sendMail: SendMailAction,
  logger: Logger
): AppEventListenerName => {
  const listenerName = Symbol('otp:listenToSendMail');

  const handle = async (
    eventName: EventName,
    messageName: MessageName,
    recipient: string,
    params: Record<string, string>
  ): Promise<void> => {
    const parsingResult = SendMailInput.safeParse({
      recipient,
      messageName,
      params,
    });

    if (!parsingResult.success) {
      logger.error(
        `${eventName} has not been handled by ${listenerName.toString()} due to incorrect payload.`
      );
      logger.debug(JSON.stringify(parsingResult.error));

      return;
    }

    await sendMail(parsingResult.data);
  };

  eventEmitter.on(
    EventName.otpGenerated,
    async ({
      userId,
      purpose,
      otp,
    }: {
      userId: string;
      purpose: OtpPurpose;
      otp: string;
    }) => {
      await handle(EventName.otpGenerated, MessageName.otp, userId, {
        purpose,
        otp,
      });
    }
  );

  eventEmitter.on(
    EventName.userPasswordChanged,
    async ({ userId }: { userId: string }) => {
      await handle(
        EventName.userPasswordChanged,
        MessageName.notification,
        userId,
        { notification: EventName.userPasswordChanged }
      );
    }
  );

  return listenerName;
};
