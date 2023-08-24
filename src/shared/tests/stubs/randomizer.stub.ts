import { Randomizer } from '../../randomizer';

export const randomizerStringStub = 'some-string';
export const randomizerStub = (
  stringToBeReturned = randomizerStringStub
): Randomizer => ({
  randomString: (size: number) => stringToBeReturned,
});
