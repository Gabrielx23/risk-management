import { Kysely } from 'kysely';

import { otpInMemoryReadModel } from './otp-in-memory.read-model';
import { otpSqlReadModel } from './otp-sql.read-model';
import { OtpReadModel } from './otp.read-model';
import { DB } from '../../../db/types';
import { Clock } from '../../../shared/clock';
import { InMemoryDb } from '../../../shared/in-memory.db';
import { createOtpRepository } from '../repositories/repository.factory';

export const createOtpReadModel = ({
  db,
  clock,
  inMemoryDb,
}: {
  db?: Kysely<DB> | null;
  inMemoryDb?: InMemoryDb;
  clock: Clock;
}): OtpReadModel => {
  return db
    ? otpSqlReadModel(createOtpRepository({ db }), clock)
    : otpInMemoryReadModel(createOtpRepository({ db, inMemoryDb }), clock);
};
