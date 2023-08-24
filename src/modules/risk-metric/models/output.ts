import { z } from 'zod';

import { Uuid } from '../../../shared/uuid';

export const RiskMetricView = z.object({
  comment: z.string(),
  likelihood: z.number().int(),
  impact: z.number().int(),
  problemId: Uuid,
  createdAt: z.date(),
  createdBy: z.object({
    id: Uuid,
    name: z.string().optional(),
  }),
});
export type RiskMetricView = z.infer<typeof RiskMetricView>;
