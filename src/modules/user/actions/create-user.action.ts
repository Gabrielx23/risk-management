import { Clock } from '../../../shared/clock';
import { Role } from '../../../shared/enum/role.enum';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { Hasher } from '../../../shared/hasher';
import { IdGenerator } from '../../../shared/uuid';
import { DEFAULT_USER_ROLE, DEFAULT_USER_SETTINGS } from '../defaults';
import { CreateUserInput } from '../models/input';
import { UserRepository, User, UserId } from '../models/user';

export type CreateUserAction = (
  input: Omit<CreateUserInput, 'passwordConfirmation'>
) => Promise<UserId>;

export const createUserAction =
  (
    userRepository: UserRepository,
    idGenerator: IdGenerator,
    hasher: Hasher,
    clock: Clock,
    eventEmitter: EventEmitter
  ): CreateUserAction =>
  async ({
    name,
    email,
    password,
    settings,
  }: Omit<CreateUserInput, 'passwordConfirmation'>): Promise<UserId> => {
    if (await userRepository.findByEmail(email)) {
      throw new UnprocessableEntityError('Email is already in use.');
    }

    const id = idGenerator();
    const now = clock();
    const user: User = {
      id,
      name,
      email,
      password: hasher.hash(password),
      createdAt: now,
      updatedAt: now,
      role: DEFAULT_USER_ROLE,
      settings: {
        ...DEFAULT_USER_SETTINGS,
        ...settings,
      },
    };

    await userRepository.create(user);

    eventEmitter.emit(EventName.userCreated, { id, name, email });

    if (user.role === Role.notActive) {
      eventEmitter.emit(EventName.userActivationRequested, { userId: id });
    }

    return id;
  };
