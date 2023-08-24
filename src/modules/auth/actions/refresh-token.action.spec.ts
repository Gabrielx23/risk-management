import { TokenPair } from '../models/output';
import { GenerateTokenPairAction } from './generate-token-pair.action';
import { UserView } from '../../user/models/output';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import assert from 'assert';
import { UnauthorizedError } from '../../../shared/errors';
import { RefreshToken, RefreshTokenRepository } from '../models/refresh-token';
import { createRefreshTokenRepository } from '../repositories/repository.factory';
import {
  RefreshTokenAction,
  createRefreshTokenAction,
} from './refresh-token.action';
import { clockStub } from '../../../shared/tests/stubs/clock.stub';
import { now } from '../../../shared/clock';
import { userReadModelStub } from '../../../shared/tests/stubs/read-models.stub';

describe('refreshToken', () => {
  const tokenPair: TokenPair = {
    authToken: 'authToken',
    refreshToken: 'refreshToken',
  };
  const refreshTokenModel: RefreshToken = {
    token: 'some-token',
    userId: '200db642-a014-46dc-b678-fc2777b4b301',
    createdAt: now(),
    expiresAt: now(),
  };
  const generateTokenPair: GenerateTokenPairAction = async (user: UserView) =>
    tokenPair;

  let refreshTokenRepository: RefreshTokenRepository;
  let refreshToken: RefreshTokenAction;

  beforeEach(() => {
    refreshTokenRepository = createRefreshTokenRepository({});
    refreshToken = createRefreshTokenAction(
      generateTokenPair,
      refreshTokenRepository,
      userReadModelStub(null),
      clockStub(),
      eventEmitterDummy
    );
  });

  it('throws an error if passed refresh token does not exist', async () => {
    await assert.rejects(
      refreshToken({ refreshToken: 'does-not-exist' }),
      new UnauthorizedError('Used refresh token is incorrect.')
    );
  });

  it('throws an error if passed refresh token is expired', async () => {
    await refreshTokenRepository.create({
      ...refreshTokenModel,
      expiresAt: new Date('2000-01-01'),
    });

    await assert.rejects(
      refreshToken({ refreshToken: refreshTokenModel.token }),
      new UnauthorizedError('Used refresh token is incorrect.')
    );
  });

  it('throws an error if related user does not exist', async () => {
    await refreshTokenRepository.create(refreshTokenModel);

    await assert.rejects(
      refreshToken({ refreshToken: refreshTokenModel.token }),
      new UnauthorizedError(
        'Cannot refresh selected token due to missing identity. Try to log in once again.'
      )
    );
  });

  it('returns token pair after successful token refresh', async () => {
    await refreshTokenRepository.create(refreshTokenModel);
    const refreshToken = createRefreshTokenAction(
      generateTokenPair,
      refreshTokenRepository,
      userReadModelStub(),
      clockStub(),
      eventEmitterDummy
    );

    const result = await refreshToken({
      refreshToken: refreshTokenModel.token,
    });

    assert.deepStrictEqual(result, tokenPair);
  });
});
