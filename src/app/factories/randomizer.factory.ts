import { randomBytes } from 'crypto';

import { Randomizer } from '../../shared/randomizer';

export const createRandomizer = (): Randomizer => ({
  randomString: (
    size: number,
    encoding: BufferEncoding = 'base64url'
  ): string => {
    return randomBytes(size).toString(encoding);
  },
});
