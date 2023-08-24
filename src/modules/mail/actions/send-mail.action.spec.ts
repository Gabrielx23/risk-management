import assert from 'assert';
import { mailerDummy } from '../../../shared/tests/dummies/mailer.dummy';
import { userViewStub } from '../../../shared/tests/stubs/models.stub';
import { userReadModelStub } from '../../../shared/tests/stubs/read-models.stub';
import { rendererStub } from '../../../shared/tests/stubs/renderer.stub';
import { translatorStub } from '../../../shared/tests/stubs/translator.stub';
import { MailMessage, MessageName, TemplateName } from '../models/message';
import { createSendMailAction } from './send-mail.action';
import { UnprocessableEntityError } from '../../../shared/errors';

describe('sendMail', () => {
  const input = {
    recipient: userViewStub.id,
    messageName: MessageName.notification,
    params: {},
  };

  it('throws an error if recipient does not exist', async () => {
    const sendMail = createSendMailAction(
      translatorStub(),
      rendererStub(),
      mailerDummy,
      userReadModelStub(null),
      new Map<MessageName, MailMessage>([])
    );

    await assert.rejects(
      sendMail(input),
      new UnprocessableEntityError('Cannot send email due to incomplete data.')
    );
  });

  it('throws an error if message is not supported', async () => {
    const sendMail = createSendMailAction(
      translatorStub(),
      rendererStub(),
      mailerDummy,
      userReadModelStub(),
      new Map<MessageName, MailMessage>([])
    );

    await assert.rejects(
      sendMail(input),
      new UnprocessableEntityError('Cannot send email due to incomplete data.')
    );
  });

  it('ends without rejection if data is correct', async () => {
    const sendMail = createSendMailAction(
      translatorStub(),
      rendererStub(),
      mailerDummy,
      userReadModelStub(),
      new Map<MessageName, MailMessage>([
        [
          input.messageName,
          {
            template: TemplateName.main,
            subject: 'Subject',
          },
        ],
      ])
    );

    await assert.doesNotReject(sendMail(input));
  });
});
