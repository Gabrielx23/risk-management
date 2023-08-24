import { UserReadModel } from './user.read-model';
import { Hasher } from '../../../shared/hasher';
import { Paginated, PaginationQuery } from '../../../shared/paginated';
import { UserView } from '../models/output';
import { User, UserEmail, UserId } from '../models/user';

export const userInMemoryReadModel = (
  hasher: Hasher,
  users: Map<UserId, User>
): UserReadModel => ({
  async findValid(
    email: UserEmail,
    password: string
  ): Promise<UserView | null> {
    const result = Array.from(users.values()).filter(
      (user: User) => user.email === email
    );
    const user = result.length ? result[0] : null;

    return user && hasher.matches(password, user.password)
      ? UserView.parse(user)
      : null;
  },
  async findById(id: UserId): Promise<UserView | null> {
    const user = users.get(id);

    return user ? UserView.parse(user) : null;
  },
  async findMany({
    page,
    limit,
    search,
  }: PaginationQuery): Promise<Paginated<UserView>> {
    const items: User[] = [];
    search = search?.toLowerCase();

    users.forEach((user: User) => {
      if (
        !search ||
        user.email.toLowerCase().includes(search) ||
        user.name.toLowerCase().includes(search)
      ) {
        items.push(user);
      }
    });

    return Paginated.parse<UserView>({
      items: items
        .map((item: User) => UserView.parse(item))
        .slice((page - 1) * limit, Math.max(1, page * limit - 1)),
      page,
      limit,
      totalItemsCount: users.size,
    });
  },
});
