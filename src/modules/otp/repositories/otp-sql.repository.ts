import { Kysely } from 'kysely';

import { DB } from '../../../db/types';
import { FindOneOtpCriteria, Otp, OtpId, OtpRepository } from '../models/otp';

export const otpSqlRepository = (db: Kysely<DB>): OtpRepository => {
  return {
    async create(otp: Otp): Promise<void> {
      await db.insertInto('otp').values(otp).execute();
    },
    async delete(id: OtpId): Promise<void> {
      await db.deleteFrom('otp').where('otp.id', '=', id).execute();
    },
    async findOne(criteria: FindOneOtpCriteria): Promise<Otp | null> {
      let query = db.selectFrom('otp');

      criteria.otp && (query = query.where('otp.otp', '=', criteria.otp));
      criteria.purpose &&
        (query = query.where('otp.purpose', '=', criteria.purpose));
      criteria.userId &&
        (query = query.where('otp.userId', '=', criteria.userId));

      const otp = await query.selectAll().executeTakeFirst();

      return otp ? (otp as Otp) : null;
    },
    async findById(id: OtpId): Promise<Otp | null> {
      const otp = await db
        .selectFrom('otp')
        .where('otp.id', '=', id)
        .selectAll()
        .executeTakeFirst();

      return otp ? (otp as Otp) : null;
    },
  };
};
