import { FindOneOtpCriteria, Otp, OtpId, OtpRepository } from '../models/otp';

export const otpInMemoryRepository = (
  otpMap: Map<OtpId, Otp>
): OtpRepository => {
  return {
    async create(otp: Otp): Promise<void> {
      otpMap.set(otp.id, otp);
    },
    async delete(id: OtpId): Promise<void> {
      otpMap.delete(id);
    },
    async findOne(criteria: FindOneOtpCriteria): Promise<Otp | null> {
      let foundOtp = null;

      otpMap.forEach((otp: Otp) => {
        let condition = true;
        criteria.otp && (condition &&= otp.otp === criteria.otp);
        criteria.purpose && (condition &&= otp.purpose === criteria.purpose);
        criteria.userId && (condition &&= otp.userId === criteria.userId);

        if (condition) {
          foundOtp = otp;
        }
      });

      return foundOtp;
    },
    async findById(id: OtpId): Promise<Otp | null> {
      return otpMap.get(id) ?? null;
    },
  };
};
