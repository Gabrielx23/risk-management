import { createAuthCompositionRoot } from './auth/auth.composition-root';
import { createMailCompositionRoot } from './mail/mail.composition-root';
import { createOtpCompositionRoot } from './otp/otp.composition-root';
import { createProblemCompositionRoot } from './problem/problem.composition-root';
import { createRiskMetricCompositionRoot } from './risk-metric/risk-metric.composition-root';
import { createUserCompositionRoot } from './user/user.composition-root';
import { CompositionRootFactory } from '../shared/composition-root';

export const compositionRootFactories: Array<CompositionRootFactory> = [
  createUserCompositionRoot,
  createAuthCompositionRoot,
  createOtpCompositionRoot,
  createMailCompositionRoot,
  createRiskMetricCompositionRoot,
  createProblemCompositionRoot,
];
