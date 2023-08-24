import { z } from 'zod';

import { MessageName } from './message';
import { Uuid } from '../../../shared/uuid';

export const SendMailInput = z.object({
  recipient: Uuid,
  messageName: z.nativeEnum(MessageName),
  params: z.record(z.string()),
});
export type SendMailInput = z.infer<typeof SendMailInput>;
