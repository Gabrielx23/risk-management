import { Kysely } from 'kysely';

import { problemInMemoryRepository } from './problem-in-memory.repository';
import { problemSqlRepository } from './problem-sql.repository';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { ProblemRepository } from '../models/problem';

export const createProblemRepository = ({
  db,
  inMemoryDb,
}: {
  inMemoryDb?: InMemoryDb | null;
  db?: Kysely<DB> | null;
}): ProblemRepository => {
  return db
    ? problemSqlRepository(db)
    : problemInMemoryRepository(
        inMemoryDb ?? new Map([['problems', new Map([])]])
      );
};
