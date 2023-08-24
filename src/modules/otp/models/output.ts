import { z } from 'zod';

import { Otp } from './otp';
import { Clock } from '../../../shared/clock';
import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';
import { Uuid } from '../../../shared/uuid';
import { OTP_REGENERATION_TIME } from '../defaults';

const ZOtpView = z.object({
  id: Uuid,
  otp: z.string(),
  purpose: z.nativeEnum(OtpPurpose),
  userId: Uuid,
  isExpired: z.boolean(),
  canBeRegenerated: z.boolean(),
});
export type OtpView = z.infer<typeof ZOtpView>;
export const OtpView = {
  parse: (otp: Otp, clock: Clock): OtpView => {
    const now = clock();
    const isExpired = now > otp.expiresAt;
    const canBeRegenerated =
      !isExpired &&
      now.getTime() > otp.createdAt.getTime() + OTP_REGENERATION_TIME * 1000;

    return ZOtpView.parse({
      ...otp,
      isExpired,
      canBeRegenerated,
    });
  },
};
