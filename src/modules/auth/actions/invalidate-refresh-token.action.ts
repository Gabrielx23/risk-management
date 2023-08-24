import { EventEmitter } from '../../../shared/events/event-emitter';
import { EventName } from '../../../shared/events/event-name.enum';
import { RefreshTokenRepository, Token } from '../models/refresh-token';

export type InvalidateRefreshTokenAction = (token: Token) => Promise<void>;

export const createInvalidateRefreshTokenAction =
  (
    refreshTokenRepository: RefreshTokenRepository,
    eventEmitter: EventEmitter
  ): InvalidateRefreshTokenAction =>
  async (token: Token): Promise<void> => {
    const refreshToken = await refreshTokenRepository.findByToken(token);

    if (!refreshToken) {
      return;
    }

    await refreshTokenRepository.delete(token);

    eventEmitter.emit(EventName.userLoggedOut, { id: refreshToken.userId });
  };
