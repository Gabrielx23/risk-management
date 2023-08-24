import { z } from 'zod';

export const LoginInput = z.object({
  email: z.string().email().max(150),
  password: z.string().min(8).max(50),
});
export type LoginInput = z.infer<typeof LoginInput>;

export const RefreshTokenInput = z.object({
  refreshToken: z.string().max(255),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenInput>;
