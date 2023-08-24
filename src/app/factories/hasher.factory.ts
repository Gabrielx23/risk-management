import * as bcrypt from 'bcryptjs';

import { Hasher } from '../../shared/hasher';

export const createHasher = (saltRounds = 10): Hasher => ({
  hash: (text: string): string => bcrypt.hashSync(text, saltRounds),
  matches: (text: string, hash: string): boolean =>
    bcrypt.compareSync(text, hash),
});
