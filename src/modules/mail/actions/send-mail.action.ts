import { Language } from '../../../shared/enum/language.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { Mailer } from '../../../shared/mailer';
import { Renderer } from '../../../shared/renderer';
import { Translator } from '../../../shared/translator';
import { UserReadModel } from '../../user/read-models/user.read-model';
import { MESSAGES_DIRECTORY, TEMPLATES_DIRECTORY } from '../defaults';
import { SendMailInput } from '../models/input';
import { MailMessage, MessageName } from '../models/message';

export type SendMailAction = (input: SendMailInput) => Promise<void>;

export const createSendMailAction =
  (
    translate: Translator,
    render: Renderer,
    sendMail: Mailer,
    userReadModel: UserReadModel,
    messages: Map<MessageName, MailMessage>
  ): SendMailAction =>
  async ({ recipient, messageName, params }: SendMailInput): Promise<void> => {
    const user = await userReadModel.findById(recipient);
    const message = messages.get(messageName);
    if (!user || !message) {
      throw new UnprocessableEntityError(
        'Cannot send email due to incomplete data.'
      );
    }

    await sendMail({
      to: user.email,
      subject: translate(user.settings.language as Language, message.subject),
      content: render(
        `${__dirname}/../${TEMPLATES_DIRECTORY}/${message.template}.ejs`,
        {
          translate,
          params,
          user,
          message: render(
            `${__dirname}/../${MESSAGES_DIRECTORY}/${messageName}.ejs`,
            { translate, params, user }
          ),
        }
      ),
    });
  };
