import {
  RefreshTokenRepository,
  RefreshToken,
  Token,
} from '../models/refresh-token';

export const refreshTokenInMemoryRepository = (
  refreshTokens: Map<Token, RefreshToken>
): RefreshTokenRepository => {
  return {
    async create(refreshToken: RefreshToken): Promise<void> {
      refreshTokens.set(refreshToken.token, refreshToken);
    },
    async findByToken(token: Token): Promise<RefreshToken | null> {
      return refreshTokens.get(token) ?? null;
    },
    async delete(token: Token): Promise<void> {
      refreshTokens.delete(token);
    },
  };
};
