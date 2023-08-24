import { FindOneOtpCriteria } from '../models/otp';
import { OtpView } from '../models/output';

export interface OtpReadModel {
  findOne(criteria: FindOneOtpCriteria): Promise<OtpView | null>;
}
