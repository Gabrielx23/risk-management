import { z } from 'zod';

import { Language } from '../../../shared/enum/language.enum';
import { Role } from '../../../shared/enum/role.enum';
import { Uuid } from '../../../shared/uuid';

const email = z.string().email().max(150);
const password = z.string().min(8).max(50);
const passwordConfirmation = z.string().min(8).max(50);
const otp = z.string().max(255);
const language = z.nativeEnum(Language);
const passwordConfirmationCb = (data: {
  password: string;
  passwordConfirmation: string;
}): boolean => data.password === data.passwordConfirmation;
const passwordConfirmationMessage = {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
};
const settings = z.object({
  language,
});

export const CreateUserInput = z
  .object({
    name: z.string().min(3).max(50),
    email,
    password,
    passwordConfirmation,
    settings: z.object({
      language,
    }),
  })
  .refine(passwordConfirmationCb, passwordConfirmationMessage);
export type CreateUserInput = z.infer<typeof CreateUserInput>;

export const GenerateActivationCodeInput = z.object({
  email,
});
export type GenerateActivationCodeInput = z.infer<
  typeof GenerateActivationCodeInput
>;

export const ActivateUserInput = z.object({
  email,
  otp,
});
export type ActivateUserInput = z.infer<typeof ActivateUserInput>;

export const ResetPasswordInput = z.object({
  email,
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordInput>;

export const ApplyPasswordResetInput = z
  .object({
    otp,
    email,
    password,
    passwordConfirmation,
  })
  .refine(passwordConfirmationCb, passwordConfirmationMessage);
export type ApplyPasswordResetInput = z.infer<typeof ApplyPasswordResetInput>;

export const ChangePasswordInput = z
  .object({
    password,
    passwordConfirmation,
    oldPassword: password,
  })
  .refine(passwordConfirmationCb, passwordConfirmationMessage);
export type ChangePasswordInput = z.infer<typeof ChangePasswordInput>;

export const UpdateUserInput = z.object({
  id: Uuid,
  name: z.string().min(3).max(50),
  email,
  role: z.nativeEnum(Role),
  settings,
});
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
