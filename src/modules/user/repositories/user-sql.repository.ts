import { Kysely, sql } from 'kysely';
import pick from 'lodash.pick';

import { DB } from '../../../db/types';
import { getTotalItemsCount } from '../../../shared/helpers/db';
import { Paginated, PaginationQuery } from '../../../shared/paginated';
import { UserRepository, UserEmail, User, UserId } from '../models/user';
import { UserSetting } from '../models/user-setting.enum';

export const userSqlRepository = (db: Kysely<DB>): UserRepository => {
  const baseQuery = db.selectFrom('users').selectAll('users');

  const baseCountQuery = db
    .selectFrom('users')
    .select<any>([sql`count(*) as count`]);

  const baseQueryWithSettings = baseQuery
    .innerJoin('userSettings as us', 'us.userId', 'users.id')
    .groupBy('users.id')
    .select<any>([sql<string>`json_object_agg(us.name, us.value) as settings`]);

  const saveSettings = async (
    userId: UserId,
    settings: Record<UserSetting, string>
  ): Promise<void> => {
    await db
      .deleteFrom('userSettings')
      .where('userSettings.userId', '=', userId)
      .execute();

    await db
      .insertInto('userSettings')
      .values(
        Object.keys(settings).map((settingName: string) => ({
          name: settingName,
          value: settings[settingName as UserSetting],
          userId,
        }))
      )
      .execute();
  };

  return {
    async create({ settings, ...user }: User): Promise<void> {
      await db.insertInto('users').values(user).execute();

      await saveSettings(user.id, settings);
    },
    async update({ settings, ...user }: User): Promise<void> {
      await db
        .updateTable('users')
        .set(pick(user, ['name', 'email', 'password', 'role', 'updatedAt']))
        .where('users.id', '=', user.id)
        .execute();

      await saveSettings(user.id, settings);
    },
    async findById(id: UserId): Promise<User | null> {
      const user = await baseQueryWithSettings
        .where('users.id', '=', id)
        .executeTakeFirst();

      return (user as User) ?? null;
    },
    async findByEmail(email: UserEmail): Promise<User | null> {
      const user = await baseQueryWithSettings
        .where('users.email', '=', email)
        .executeTakeFirst();

      return (user as User) ?? null;
    },
    async delete(id: UserId): Promise<void> {
      await db.deleteFrom('users').where('users.id', '=', id).execute();
    },
    async findMany({
      page,
      limit,
      sortBy,
      sortDirection,
      search,
    }: PaginationQuery): Promise<Paginated<User>> {
      const searchValue = `%${search ?? ''}%`;
      const items = (await baseQueryWithSettings
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

      const countResult = await baseCountQuery
        .where((eb) =>
          eb.or([
            eb('users.name', 'ilike', searchValue),
            eb('users.email', 'ilike', searchValue),
          ])
        )
        .execute();

      return Paginated.parse<User>({
        items,
        page,
        limit,
        totalItemsCount: getTotalItemsCount(countResult),
      });
    },
  };
};
