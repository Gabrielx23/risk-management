import { z } from 'zod';

import { AppMode } from './app/app-mode.enum';

const Config = z.object({
  PORT: z.coerce.number(),
  ENDPOINT_PREFIX: z.string().optional(),
  MODE: z.nativeEnum(AppMode),
  CORS_WHITELIST: z.string().refine(
    (value) => {
      const parts = value.split(',');

      return parts.every((part) => part.trim().length > 0);
    },
    {
      message: 'Invalid comma-separated string format',
    }
  ),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  MAIL_SMTP_CONNECTION_URI: z.string(),
  MAIL_FROM: z.string(),
});

export type Config = z.infer<typeof Config>;

export const config = Config.parse(process.env);
