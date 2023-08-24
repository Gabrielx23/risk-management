import { Kysely } from 'kysely';

import { problemInMemoryReadModel } from './problem-in-memory.read-model';
import { problemSqlReadModel } from './problem-sql.read-model';
import { ProblemReadModel } from './problem.read-model';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';

export const createProblemReadModel = ({
  db,
  inMemoryDb,
}: {
  inMemoryDb?: InMemoryDb | null;
  db?: Kysely<DB> | null;
}): ProblemReadModel => {
  return db
    ? problemSqlReadModel(db)
    : problemInMemoryReadModel(inMemoryDb ?? new Map([]));
};
