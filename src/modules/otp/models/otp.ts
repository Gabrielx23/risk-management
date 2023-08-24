import { OtpPurpose } from '../../../shared/enum/otp-purpose.enum';

export type OtpId = string;
export type OtpValue = string;
export type UserId = string;

export type Otp = {
  id: OtpId;
  otp: OtpValue;
  purpose: OtpPurpose;
  userId: UserId;
  createdAt: Date;
  expiresAt: Date;
};

export type FindOneOtpCriteria = Partial<
  Pick<Otp, 'otp' | 'purpose' | 'userId'>
>;
export interface OtpRepository {
  create(otp: Otp): Promise<void>;
  delete(id: OtpId): Promise<void>;
  findOne(criteria: FindOneOtpCriteria): Promise<Otp | null>;
  findById(id: OtpId): Promise<Otp | null>;
}
