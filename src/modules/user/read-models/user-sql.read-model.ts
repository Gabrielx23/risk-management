import { Kysely, sql } from 'kysely';

import { UserReadModel } from './user.read-model';
import { DB } from '../../../db/types';
import { Hasher } from '../../../shared/hasher';
import { getTotalItemsCount } from '../../../shared/helpers/db';
import { Paginated, PaginationQuery } from '../../../shared/paginated';
import { UserView } from '../models/output';
import { UserRepository, UserEmail, UserId, User } from '../models/user';

export const userSqlReadModel = (
  db: Kysely<DB>,
  userRepository: UserRepository,
  hasher: Hasher
): UserReadModel => ({
  async findValid(
    email: UserEmail,
    password: string
  ): Promise<UserView | null> {
    const user = await userRepository.findByEmail(email);

    return user && hasher.matches(password, user.password)
      ? UserView.parse(user)
      : null;
  },
  async findById(id: UserId): Promise<UserView | null> {
    const user = await userRepository.findById(id);

    return user ? UserView.parse(user) : null;
  },
  async findMany({
    page,
    limit,
    sortBy,
    sortDirection,
    search,
  }: PaginationQuery): Promise<Paginated<UserView>> {
    const searchValue = `%${search ?? ''}%`;
    const items = (await db
      .selectFrom('users')
      .selectAll('users')
      .innerJoin('userSettings as us', 'us.userId', 'users.id')
      .groupBy('users.id')
      .select<any>([
        sql<string>`json_object_agg(us.name, us.value) as settings`,
      ])
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(sortBy ?? 'users.createdAt', sortDirection)
      .where((eb) =>
        eb.or([
          eb('users.name', 'ilike', searchValue),
          eb('users.email', 'ilike', searchValue),
        ])
      )
      .execute()) as User[];

    const countResult = await db
      .selectFrom('users')
      .select<any>([sql`count(*) as count`])
      .where((eb) =>
        eb.or([
          eb('users.name', 'ilike', searchValue),
          eb('users.email', 'ilike', searchValue),
        ])
      )
      .execute();

    return Paginated.parse<UserView>({
      items: items.map((item: User) => UserView.parse(item)),
      page,
      limit,
      totalItemsCount: getTotalItemsCount(countResult),
    });
  },
});
