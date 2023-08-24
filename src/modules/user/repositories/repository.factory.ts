import { Kysely } from 'kysely';

import { userInMemoryRepository } from './user-in-memory.repository';
import { userSqlRepository } from './user-sql.repository';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { User, UserId, UserRepository } from '../models/user';

export const createUserRepository = ({
  db,
  inMemoryDb,
}: {
  db?: Kysely<DB>;
  inMemoryDb?: InMemoryDb;
}): UserRepository => {
  return db
    ? userSqlRepository(db)
    : userInMemoryRepository(
        inMemoryDb
          ? (inMemoryDb.get('users') as Map<UserId, User>)
          : new Map([])
      );
};
