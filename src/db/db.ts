import { Kysely, PostgresDialect, Transaction } from 'kysely';
import { Pool } from 'pg';

import { DB } from './types';

export const createDb = (connectionString: string): Kysely<DB> =>
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
      }),
    }),
  });

export const transactional =
  <D>(db: Kysely<D>) =>
  <A extends any[], R>(
    fn: (tx: Transaction<D>) => (...args: A) => Promise<R>
  ) =>
  (...args: A): Promise<R> => {
    return db.transaction().execute((trx) => fn(trx)(...args));
  };

export type WithTx<D> = ReturnType<typeof transactional<D>>;
