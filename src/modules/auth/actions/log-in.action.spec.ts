import { TokenPair } from '../models/output';
import { createLogInAction } from './log-in.action';
import { GenerateTokenPairAction } from './generate-token-pair.action';
import { UserView } from '../../user/models/output';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import assert from 'assert';
import { NotFoundError } from '../../../shared/errors';
import { userReadModelStub } from '../../../shared/tests/stubs/read-models.stub';

describe('logIn', () => {
  const input = {
    email: 'john.doe@company.com',
    password: 'some-pass',
  };
  const tokenPair: TokenPair = {
    authToken: 'authToken',
    refreshToken: 'refreshToken',
  };
  const generateTokenPair: GenerateTokenPairAction = async (user: UserView) =>
    tokenPair;

  it('throws an error if given credentials are wrong', async () => {
    const logIn = createLogInAction(
      generateTokenPair,
      userReadModelStub(null),
      eventEmitterDummy
    );

    await assert.rejects(
      logIn(input),
      new NotFoundError('User with given credentials does not exist.')
    );
  });

  it('returns token pair after successful login', async () => {
    const logIn = createLogInAction(
      generateTokenPair,
      userReadModelStub(),
      eventEmitterDummy
    );

    const result = await logIn(input);

    assert.deepStrictEqual(result, tokenPair);
  });
});
