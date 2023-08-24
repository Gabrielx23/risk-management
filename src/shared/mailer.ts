export type MailerParams = {
  to: string;
  subject: string;
  content: string;
};
export type Mailer = (params: MailerParams) => Promise<void>;
