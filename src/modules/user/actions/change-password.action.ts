import { Clock } from '../../../shared/clock';
import { UnprocessableEntityError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { Hasher } from '../../../shared/hasher';
import { ChangePasswordInput } from '../models/input';
import { UserView } from '../models/output';
import { UserRepository } from '../models/user';

export type ChangePasswordAction = (
  input: ChangePasswordInput,
  loggedUser: UserView
) => Promise<void>;

export const createChangePasswordAction =
  (
    userRepository: UserRepository,
    eventEmitter: EventEmitter,
    hasher: Hasher,
    now: Clock
  ): ChangePasswordAction =>
  async (
    { password, oldPassword }: ChangePasswordInput,
    loggedUser: UserView
  ) => {
    const user = await userRepository.findById(loggedUser.id);
    if (!user) {
      throw new UnprocessableEntityError('Password change failed.');
    }

    if (!hasher.matches(oldPassword, user.password)) {
      throw new UnprocessableEntityError('Old password is incorrect.');
    }

    await userRepository.update({
      ...user,
      password: hasher.hash(password),
      updatedAt: now(),
    });

    eventEmitter.emit(EventName.userPasswordChanged, { userId: user.id });
  };
