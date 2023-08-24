import { UserSetting } from './user-setting.enum';
import { Role } from '../../../shared/enum/role.enum';
import { Paginated, PaginationQuery } from '../../../shared/paginated';

export type UserId = string;
export type UserEmail = string;
export const userSortableColumns: [string, ...string[]] = [
  'users.name',
  'users.email',
  'users.role',
  'users.createdAt',
  'users.updatedAt',
];

export type User = {
  id: UserId;
  name: string;
  role: Role;
  email: UserEmail;
  password: string;
  settings: Record<UserSetting, string>;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(id: UserEmail): Promise<User | null>;
  findByEmail(id: UserEmail): Promise<User | null>;
  findMany(query: PaginationQuery): Promise<Paginated<User>>;
}
