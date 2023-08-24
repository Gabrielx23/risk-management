import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { UserId, UserRepository } from '../models/user';

export type DeleteUserAction = (userId: UserId) => Promise<void>;

export const createDeleteUserAction =
  (
    userRepository: UserRepository,
    eventEmitter: EventEmitter
  ): DeleteUserAction =>
  async (userId: UserId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      return;
    }

    await userRepository.delete(userId);

    eventEmitter.emit(EventName.userDeleted, { id: user.id });
  };
