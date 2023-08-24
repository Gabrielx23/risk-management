import merge from 'lodash.merge';

import { Clock } from '../../../shared/clock';
import {
  NotFoundError,
  UnprocessableEntityError,
} from '../../../shared/errors';
import { UpdateUserInput } from '../models/input';
import { UserRepository } from '../models/user';

export type UpdateUserAction = (input: UpdateUserInput) => Promise<void>;

export const createUpdateUserAction =
  (userRepository: UserRepository, now: Clock): UpdateUserAction =>
  async ({ id, ...input }: UpdateUserInput) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User does not exist.');
    }

    const email = input.email;
    if (
      email &&
      user.email !== email &&
      (await userRepository.findByEmail(email))
    ) {
      throw new UnprocessableEntityError(
        'Selected email address is already in use.'
      );
    }

    await userRepository.update(
      merge(user, {
        ...input,
        updatedAt: now(),
      })
    );
  };
