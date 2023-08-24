import { Paginated, PaginationQuery } from '../../../shared/paginated';
import { UserView } from '../models/output';
import { UserEmail, UserId } from '../models/user';

export interface UserReadModel {
  findValid(email: UserEmail, password: string): Promise<UserView | null>;
  findById(id: UserId): Promise<UserView | null>;
  findMany(criteria: PaginationQuery): Promise<Paginated<UserView>>;
}
