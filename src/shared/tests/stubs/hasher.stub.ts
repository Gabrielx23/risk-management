import { Hasher } from '../../hasher';

export const hasherHashStub = 'hashed';

export const hasherStub = (
  hashedStringToBeReturned = hasherHashStub,
  matchesResultToBeReturned = true
): Hasher => ({
  hash: (text: string) => hashedStringToBeReturned,
  matches: (text: string, hash: string) => matchesResultToBeReturned,
});
