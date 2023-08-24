import * as jwt from 'jsonwebtoken';

import { Jwt } from '../../shared/jwt';

export const createJwt = (
  secret: string,
  algorithm: 'HS256' | 'HS384' | 'HS512' = 'HS512'
): Jwt => ({
  sign: (payload: string | object | Buffer): string => {
    return jwt.sign(payload, secret, { algorithm });
  },

  verify: <PayloadT>(token: string): PayloadT | null => {
    try {
      return jwt.verify(token, secret) as PayloadT;
    } catch (error) {
      return null;
    }
  },
});
