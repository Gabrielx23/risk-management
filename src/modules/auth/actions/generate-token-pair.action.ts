import { Clock } from '../../../shared/clock';
import { Role } from '../../../shared/enum/role.enum';
import { ForbiddenError } from '../../../shared/errors';
import { Jwt } from '../../../shared/jwt';
import { Randomizer } from '../../../shared/randomizer';
import { UserView } from '../../user/models/output';
import {
  JWT_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from '../defaults';
import { TokenPair } from '../models/output';
import { RefreshTokenRepository, RefreshToken } from '../models/refresh-token';

export type GenerateTokenPairAction = (user: UserView) => Promise<TokenPair>;

export const createGenerateTokenPairAction =
  (
    jwtGenerator: Jwt,
    randomizer: Randomizer,
    refreshTokenRepository: RefreshTokenRepository,
    clock: Clock
  ): GenerateTokenPairAction =>
  async (user: UserView): Promise<TokenPair> => {
    if (user.role === Role.notActive) {
      throw new ForbiddenError('Your account is not active.');
    }

    if (user.role === Role.blocked) {
      throw new ForbiddenError('Your account is blocked.');
    }

    const now = clock();
    const currentTimestamp = Math.floor(now.getTime() / 1000);

    const jwt = jwtGenerator.sign({
      data: user,
      exp: currentTimestamp + JWT_EXPIRATION_TIME,
    });

    const refreshToken: RefreshToken = {
      token: randomizer.randomString(64) + user.id + currentTimestamp,
      userId: user.id,
      createdAt: now,
      expiresAt: new Date(
        (currentTimestamp + REFRESH_TOKEN_EXPIRATION_TIME) * 1000
      ),
    };

    await refreshTokenRepository.create(refreshToken);

    return {
      authToken: jwt,
      refreshToken: refreshToken.token,
    };
  };
