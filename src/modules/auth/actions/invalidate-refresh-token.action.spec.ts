import assert from 'assert';
import { now } from '../../../shared/clock';
import { eventEmitterDummy } from '../../../shared/tests/dummies/event-emitter.dummy';
import { RefreshTokenRepository } from '../models/refresh-token';
import { createRefreshTokenRepository } from '../repositories/repository.factory';
import {
  InvalidateRefreshTokenAction,
  createInvalidateRefreshTokenAction,
} from './invalidate-refresh-token.action';

describe('invalidateRefreshToken', () => {
  let repository: RefreshTokenRepository;
  let invalidateRefreshToken: InvalidateRefreshTokenAction;

  beforeEach(() => {
    repository = createRefreshTokenRepository({});
    invalidateRefreshToken = createInvalidateRefreshTokenAction(
      repository,
      eventEmitterDummy
    );
  });

  it('properly invalidates passed refresh token', async () => {
    const refreshToken = {
      token: 'some-token',
      userId: '200db642-a014-46dc-b678-fc2777b4b301',
      createdAt: now(),
      expiresAt: now(),
    };

    await repository.create(refreshToken);
    await invalidateRefreshToken(refreshToken.token);

    const foundToken = await repository.findByToken(refreshToken.token);
    assert.equal(foundToken, null);
  });
});
