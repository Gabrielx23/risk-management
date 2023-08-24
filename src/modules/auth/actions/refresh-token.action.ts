import { GenerateTokenPairAction } from './generate-token-pair.action';
import { Clock } from '../../../shared/clock';
import { UnauthorizedError } from '../../../shared/errors';
import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { UserReadModel } from '../../user/read-models/user.read-model';
import { RefreshTokenInput } from '../models/input';
import { TokenPair } from '../models/output';
import { RefreshTokenRepository } from '../models/refresh-token';

export type RefreshTokenAction = (
  input: RefreshTokenInput
) => Promise<TokenPair>;

export const createRefreshTokenAction =
  (
    generateTokenPair: GenerateTokenPairAction,
    refreshTokenRepository: RefreshTokenRepository,
    userReadModel: UserReadModel,
    clock: Clock,
    eventEmitter: EventEmitter
  ): RefreshTokenAction =>
  async ({ refreshToken: refreshTokenValue }: RefreshTokenInput) => {
    const now = clock();
    const refreshToken = await refreshTokenRepository.findByToken(
      refreshTokenValue
    );

    if (!refreshToken || now > new Date(refreshToken.expiresAt)) {
      throw new UnauthorizedError('Used refresh token is incorrect.');
    }

    const user = await userReadModel.findById(refreshToken.userId);

    if (!user) {
      throw new UnauthorizedError(
        'Cannot refresh selected token due to missing identity. Try to log in once again.'
      );
    }

    await refreshTokenRepository.delete(refreshToken.token);

    const tokenPair = await generateTokenPair(user);

    eventEmitter.emit(EventName.userLoggedIn, { id: user.id });

    return tokenPair;
  };
