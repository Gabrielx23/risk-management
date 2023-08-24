import { Kysely } from 'kysely';

import { refreshTokenInMemoryRepository } from './refresh-token-in-memory.repository';
import { refreshTokenSqlRepository } from './refresh-token-sql.repository';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import {
  RefreshToken,
  RefreshTokenRepository,
  Token,
} from '../models/refresh-token';

export const createRefreshTokenRepository = ({
  db,
  inMemoryDb,
}: {
  db?: Kysely<DB>;
  inMemoryDb?: InMemoryDb;
}): RefreshTokenRepository => {
  return db
    ? refreshTokenSqlRepository(db)
    : refreshTokenInMemoryRepository(
        inMemoryDb
          ? (inMemoryDb.get('refreshTokens') as Map<Token, RefreshToken>)
          : new Map<Token, RefreshToken>([])
      );
};
