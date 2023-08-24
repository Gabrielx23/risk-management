import { Kysely } from 'kysely';

import { userInMemoryReadModel } from './user-in-memory.read-model';
import { userSqlReadModel } from './user-sql.read-model';
import { UserReadModel } from './user.read-model';
import { DB } from '../../../db/types';
import { Hasher } from '../../../shared/hasher';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { User, UserId } from '../models/user';
import { createUserRepository } from '../repositories/repository.factory';

export const createUserReadModel = ({
  db,
  inMemoryDb,
  hasher,
}: {
  db?: Kysely<DB> | null;
  inMemoryDb?: InMemoryDb;
  hasher: Hasher;
}): UserReadModel => {
  return db
    ? userSqlReadModel(db, createUserRepository({ db }), hasher)
    : userInMemoryReadModel(
        hasher,
        inMemoryDb
          ? (inMemoryDb.get('users') as Map<UserId, User>)
          : new Map([])
      );
};
