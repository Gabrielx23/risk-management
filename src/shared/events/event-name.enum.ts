export enum EventName {
  userDeleted = 'user.deleted',
  userLoggedIn = 'user.loggedIn',
  userLoggedOut = 'user.loggedOut',
  userCreated = 'user.created',
  userPasswordResetRequested = 'user.passwordResetRequested',
  userPasswordChanged = 'user.passwordChanged',
  userActivationRequested = 'user.activationRequested',
  userActivated = 'user.activated',
  otpGenerated = 'otp.generated',
  otpInvalidated = 'otp.invalidated',
  otpUsed = 'otp.used',
}
