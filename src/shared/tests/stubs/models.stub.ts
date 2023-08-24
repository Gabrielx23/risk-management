import omit from 'lodash.omit';
import pick from 'lodash.pick';

import { hasherHashStub } from './hasher.stub';
import { Otp } from '../../../modules/otp/models/otp';
import { OtpView } from '../../../modules/otp/models/output';
import { ProblemView } from '../../../modules/problem/models/output';
import { Problem } from '../../../modules/problem/models/problem';
import { RiskMetricView } from '../../../modules/risk-metric/models/output';
import { RiskMetric } from '../../../modules/risk-metric/models/risk-metric';
import { UserView } from '../../../modules/user/models/output';
import { User } from '../../../modules/user/models/user';
import { Language } from '../../enum/language.enum';
import { OtpPurpose } from '../../enum/otp-purpose.enum';
import { Role } from '../../enum/role.enum';

export const userStub: User = {
  id: '200db642-a014-46dc-b678-fc2777b4b301',
  name: 'John Doe',
  email: 'john.doe@company.com',
  password: hasherHashStub,
  role: Role.admin,
  settings: {
    language: Language.en,
  },
  createdAt: new Date('2023-08-02T00:00:00.000Z'),
  updatedAt: new Date('2023-08-02T00:00:00.000Z'),
};
export const userViewStub: UserView = omit(userStub, 'password');

export const otpViewStub: OtpView = {
  id: '200db642-a014-46dc-b678-fc2777b4b301',
  userId: '200db642-a014-46dc-b678-fc2777b4b301',
  otp: 'some-otp',
  purpose: OtpPurpose.accountActivation,
  isExpired: true,
  canBeRegenerated: false,
};
export const otpStub: Otp = {
  ...pick(otpViewStub, ['purpose', 'userId', 'otp', 'id']),
  createdAt: new Date('2023-08-02T00:00:00.000Z'),
  expiresAt: new Date('2023-08-02T00:00:00.000Z'),
};

export const problemStub: Problem = {
  id: '200db642-a014-46dc-b678-fc2777b4b301',
  title: 'some problem',
  description: 'some problem description',
  result: 1,
  createdBy: userViewStub.id,
  solvedAt: null,
  createdAt: new Date('2023-08-02T00:00:00.000Z'),
  updatedAt: new Date('2023-08-02T00:00:00.000Z'),
};
export const problemViewStub: ProblemView = {
  ...problemStub,
  createdBy: pick(userViewStub, ['id', 'name']),
  designatedUsers: [pick(userViewStub, ['id', 'name'])],
  risk: {
    likelihood: 10,
    impact: 5,
    calculated: 50,
  },
};

export const riskMetricStub: RiskMetric = {
  id: '200db642-a014-46dc-b678-fc2777b4b301',
  likelihood: 10,
  impact: 5,
  comment: 'something happen',
  createdBy: userViewStub.id,
  problemId: problemStub.id,
  createdAt: new Date('2023-08-02T00:00:00.000Z'),
};
export const riskMetricViewStub: RiskMetricView = {
  ...omit(riskMetricStub, ['id']),
  createdBy: pick(userViewStub, ['id', 'name']),
};
