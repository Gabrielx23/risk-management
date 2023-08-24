export type Token = string;
export type UserId = string;

export type RefreshToken = {
  token: Token;
  userId: UserId;
  createdAt: Date;
  expiresAt: Date;
};

export interface RefreshTokenRepository {
  findByToken(token: Token): Promise<RefreshToken | null>;
  create(token: RefreshToken): Promise<void>;
  delete(token: Token): Promise<void>;
}
