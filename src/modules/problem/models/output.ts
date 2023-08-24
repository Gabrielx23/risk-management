import { z } from 'zod';

import { Uuid } from '../../../shared/uuid';

const metric = z.number().int().default(0);
const user = z.object({
  id: Uuid,
  name: z.string().optional(),
});
export const ProblemView = z.object({
  id: Uuid,
  title: z.string(),
  description: z.string().nullable(),
  result: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  solvedAt: z.date().nullable(),
  createdBy: user,
  designatedUsers: z.array(user),
  risk: z.object({
    likelihood: metric,
    impact: metric,
    calculated: metric,
  }),
});
export type ProblemView = z.infer<typeof ProblemView>;
