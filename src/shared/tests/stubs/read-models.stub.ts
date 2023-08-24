import { otpViewStub, problemViewStub, userViewStub } from './models.stub';
import { FindOneOtpCriteria } from '../../../modules/otp/models/otp';
import { OtpView } from '../../../modules/otp/models/output';
import { OtpReadModel } from '../../../modules/otp/read-models/otp.read-model';
import { ProblemPaginationQuery } from '../../../modules/problem/models/input';
import { ProblemView } from '../../../modules/problem/models/output';
import { ProblemId } from '../../../modules/problem/models/problem';
import { ProblemReadModel } from '../../../modules/problem/read-models/problem.read-model';
import { UserView } from '../../../modules/user/models/output';
import { UserReadModel } from '../../../modules/user/read-models/user.read-model';
import { Paginated, PaginationQuery } from '../../paginated';

export const userReadModelStub = (
  valueToBeReturned: UserView | null = userViewStub
): UserReadModel => ({
  findValid: async (
    email: string,
    password: string
  ): Promise<UserView | null> => valueToBeReturned,
  findById: async (id: string): Promise<UserView | null> => valueToBeReturned,
  findMany: async (criteria: PaginationQuery): Promise<Paginated<UserView>> =>
    Paginated.parse({
      items: [userViewStub],
      totalItemsCount: 1,
      page: 1,
      limit: 1,
    }),
});

export const otpReadModelStub = (
  valueToBeReturned: OtpView | null = otpViewStub
): OtpReadModel => ({
  findOne: async (criteria: FindOneOtpCriteria): Promise<OtpView | null> =>
    valueToBeReturned,
});

export const problemReadModelStub = (
  valueToBeReturned: ProblemView | null = problemViewStub
): ProblemReadModel => ({
  findByIdForUser: async (id: ProblemId): Promise<ProblemView | null> =>
    valueToBeReturned,
  findMany: async (
    criteria: ProblemPaginationQuery
  ): Promise<Paginated<ProblemView>> =>
    Paginated.parse({
      items: [problemViewStub],
      totalItemsCount: 1,
      page: 1,
      limit: 1,
    }),
});
