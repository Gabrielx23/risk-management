import { Kysely } from 'kysely';

import { otpInMemoryRepository } from './otp-in-memory.repository';
import { otpSqlRepository } from './otp-sql.repository';
import { DB } from '../../../db/types';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { Otp, OtpId, OtpRepository } from '../models/otp';

export const createOtpRepository = ({
  db,
  inMemoryDb,
}: {
  db?: Kysely<DB> | null;
  inMemoryDb?: InMemoryDb;
}): OtpRepository => {
  return db
    ? otpSqlRepository(db)
    : otpInMemoryRepository(
        inMemoryDb
          ? (inMemoryDb.get('otp') as Map<OtpId, Otp>)
          : new Map<OtpId, Otp>([])
      );
};
