import { Kysely } from 'kysely';
import pick from 'lodash.pick';

import { DB } from '../../../db/types';
import { Problem, ProblemId, ProblemRepository } from '../models/problem';

export const problemSqlRepository = (db: Kysely<DB>): ProblemRepository => ({
  async findById(id: ProblemId): Promise<Problem | null> {
    const problem = await db
      .selectFrom('problems')
      .selectAll()
      .where('problems.id', '=', id)
      .executeTakeFirst();

    return (problem as Problem) ?? null;
  },
  async create(problem: Problem): Promise<void> {
    await db.insertInto('problems').values(problem).execute();
  },
  async update(problem: Problem): Promise<void> {
    await db
      .updateTable('problems')
      .set(
        pick(problem, [
          'title',
          'description',
          'solvedAt',
          'result',
          'updatedAt',
        ])
      )
      .where('problems.id', '=', problem.id)
      .execute();
  },
  async delete(id: ProblemId): Promise<void> {
    await db.deleteFrom('problems').where('problems.id', '=', id).execute();
  },
});
