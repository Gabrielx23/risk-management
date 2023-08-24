import * as nodemailer from 'nodemailer';

import { Config } from '../../config';
import { Logger } from '../../shared/logger';
import { Mailer, MailerParams } from '../../shared/mailer';

export const createMailer =
  (config: Config, logger: Logger): Mailer =>
  async ({ to, subject, content }: MailerParams): Promise<void> => {
    try {
      const transport = nodemailer.createTransport(
        config.MAIL_SMTP_CONNECTION_URI
      );

      await transport.sendMail({
        to,
        from: config.MAIL_FROM,
        subject,
        html: content,
      });
    } catch (error) {
      logger.error(
        'An unexpected error has been occurred during mail sending process.'
      );
      logger.debug(JSON.stringify(error));
    }
  };
