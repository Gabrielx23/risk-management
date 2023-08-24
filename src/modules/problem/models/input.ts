import { z } from 'zod';

import { problemSortableColumns } from './problem';
import { PaginationQueryParseRules } from '../../../shared/paginated';
import { Uuid } from '../../../shared/uuid';
import { MAX_RESULT_VALUE, MIN_RESULT_VALUE } from '../defaults';

export const ProblemPaginationQuery = PaginationQueryParseRules(
  problemSortableColumns
).extend({
  userId: Uuid,
});
export type ProblemPaginationQuery = z.infer<
  typeof ProblemPaginationQuery & {
    sortBy: (typeof problemSortableColumns)[number];
  }
>;

export const AddProblemInput = z.object({
  title: z.string().min(3).max(250),
  description: z.string().min(3).max(250).nullable(),
  userId: Uuid,
});
export type AddProblemInput = z.infer<typeof AddProblemInput>;

export const DeleteProblemInput = z.object({
  problemId: Uuid,
  userId: Uuid,
});
export type DeleteProblemInput = z.infer<typeof DeleteProblemInput>;

export const UpdateProblemInput = z.object({
  title: z.string().min(3).max(250),
  description: z.string().min(3).max(250).nullable(),
  result: z
    .number()
    .int()
    .min(MIN_RESULT_VALUE)
    .max(MAX_RESULT_VALUE)
    .nullable(),
  userId: Uuid,
  problemId: Uuid,
});
export type UpdateProblemInput = z.infer<typeof UpdateProblemInput>;
