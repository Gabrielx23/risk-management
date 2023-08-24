import { Kysely } from 'kysely';

import { DB } from '../../../db/types';
import {
  RefreshTokenRepository,
  RefreshToken,
  Token,
} from '../models/refresh-token';

export const refreshTokenSqlRepository = (
  db: Kysely<DB>
): RefreshTokenRepository => {
  return {
    async create(refreshToken: RefreshToken): Promise<void> {
      await db.insertInto('refreshTokens').values(refreshToken).execute();
    },
    async findByToken(token: Token): Promise<RefreshToken | null> {
      const refreshToken = await db
        .selectFrom('refreshTokens')
        .where('refreshTokens.token', '=', token)
        .selectAll()
        .executeTakeFirst();

      return refreshToken ? (refreshToken as RefreshToken) : null;
    },
    async delete(token: Token): Promise<void> {
      await db
        .deleteFrom('refreshTokens')
        .where('refreshTokens.token', '=', token)
        .executeTakeFirst();
    },
  };
};
