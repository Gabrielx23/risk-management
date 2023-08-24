import { z } from 'zod';

import { Role } from '../../../shared/enum/role.enum';

export const UserView = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.nativeEnum(Role),
  settings: z.record(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserView = z.infer<typeof UserView>;
