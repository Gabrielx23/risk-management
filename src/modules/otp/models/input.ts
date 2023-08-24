import { z } from 'zod';

import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { Uuid } from '../../../shared/uuid';

export const GenerateOtpInput = z.object({
  purpose: z.nativeEnum(OtpPurpose),
  userId: Uuid,
});
export type GenerateOtpInput = z.infer<typeof GenerateOtpInput>;

export const InvalidateOtpInput = z.object({
  id: Uuid,
});
export type InvalidateOtpInput = z.infer<typeof InvalidateOtpInput>;
