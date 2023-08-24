import { Paginated } from '../../../shared/paginated';
import { ProblemPaginationQuery } from '../models/input';
import { ProblemView } from '../models/output';
import { ProblemId, UserId } from '../models/problem';

export interface ProblemReadModel {
  findByIdForUser(id: ProblemId, user: UserId): Promise<ProblemView | null>;
  findMany(criteria: ProblemPaginationQuery): Promise<Paginated<ProblemView>>;
}
