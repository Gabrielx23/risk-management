export enum TemplateName {
  main = 'main',
}

export enum MessageName {
  otp = 'otp',
  notification = 'notification',
}

export type MailMessage = {
  template: TemplateName;
  subject: string;
};

export const Messages = new Map<MessageName, MailMessage>([
  [
    MessageName.otp,
    {
      template: TemplateName.main,
      subject: 'One Time Password',
    },
  ],
  [
    MessageName.notification,
    {
      template: TemplateName.main,
      subject: 'Notification',
    },
  ],
]);
