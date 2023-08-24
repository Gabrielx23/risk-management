import { OtpReadModel } from './otp.read-model';
import { Clock } from '../../../shared/clock';
import { FindOneOtpCriteria, OtpRepository } from '../models/otp';
import { OtpView } from '../models/output';

export const otpSqlReadModel = (
  otpRepository: OtpRepository,
  clock: Clock
): OtpReadModel => ({
  async findOne(criteria: FindOneOtpCriteria): Promise<OtpView | null> {
    const otp = await otpRepository.findOne(criteria);

    return otp ? OtpView.parse(otp, clock) : null;
  },
});
