import { Paginated, PaginationQuery } from '../../../shared/paginated';
import { UserRepository, User, UserEmail, UserId } from '../models/user';

export const userInMemoryRepository = (
  users: Map<UserId, User>
): UserRepository => {
  return {
    async create(user: User): Promise<void> {
      users.set(user.id, user);
    },
    async update(user: User): Promise<void> {
      users.set(user.id, user);
    },
    async findById(id: UserId): Promise<User | null> {
      return users.get(id) ?? null;
    },
    async findByEmail(email: UserEmail): Promise<User | null> {
      let user = null;
      users.forEach((currentUser: User) => {
        if (currentUser.email === email) {
          user = currentUser;
        }
      });

      return user;
    },
    async delete(id: UserId): Promise<void> {
      users.delete(id);
    },
    async findMany({
      page,
      limit,
      search,
    }: PaginationQuery): Promise<Paginated<User>> {
      const items: User[] = [];
      search = search?.toLowerCase();

      users.forEach((user: User) => {
        if (limit && items.length >= limit) return;

        if (
          !search ||
          user.email.toLowerCase().includes(search) ||
          user.name.toLowerCase().includes(search)
        ) {
          items.push(user);
        }
      });

      return Paginated.parse<User>({
        items,
        page,
        limit,
        totalItemsCount: users.size,
      });
    },
  };
};
