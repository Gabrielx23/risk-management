import { GenerateTokenPairAction } from './generate-token-pair.action';
import { NotFoundError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { UserReadModel } from '../../user/read-models/user.read-model';
import { LoginInput } from '../models/input';
import { TokenPair } from '../models/output';

export type LogInAction = (input: LoginInput) => Promise<TokenPair>;

export const createLogInAction =
  (
    generateTokenPair: GenerateTokenPairAction,
    userReadModel: UserReadModel,
    eventEmitter: EventEmitter
  ): LogInAction =>
  async ({ email, password }: LoginInput) => {
    const user = await userReadModel.findValid(email, password);

    if (!user) {
      throw new NotFoundError('User with given credentials does not exist.');
    }

    const tokenPair = await generateTokenPair(user);

    eventEmitter.emit(EventName.userLoggedIn, { id: user.id });

    return tokenPair;
  };
