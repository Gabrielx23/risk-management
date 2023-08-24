import {
  clockDateStub,
  clockStub,
} from '../../../shared/tests/stubs/clock.stub';
import {
  jwtGeneratorStub,
  jwtGeneratorTokenStub,
} from '../../../shared/tests/stubs/jwt-generator.stub';
import {
  randomizerStringStub,
  randomizerStub,
} from '../../../shared/tests/stubs/randomizer.stub';
import { userViewStub } from '../../../shared/tests/stubs/models.stub';
import { REFRESH_TOKEN_EXPIRATION_TIME } from '../defaults';
import { RefreshTokenRepository } from '../models/refresh-token';
import { createRefreshTokenRepository } from '../repositories/repository.factory';
import {
  GenerateTokenPairAction,
  createGenerateTokenPairAction,
} from './generate-token-pair.action';
import assert from 'assert';
import { Role } from '../../../shared/enum/role.enum';
import { ForbiddenError } from '../../../shared/errors';

describe('generateTokenPair', () => {
  let repository: RefreshTokenRepository;
  let generateTokenPair: GenerateTokenPairAction;

  beforeEach(() => {
    repository = createRefreshTokenRepository({});
    generateTokenPair = createGenerateTokenPairAction(
      jwtGeneratorStub(),
      randomizerStub(),
      repository,
      clockStub()
    );
  });

  it('throws an error if user is not active', async () => {
    await assert.rejects(
      generateTokenPair({
        ...userViewStub,
        role: Role.notActive,
      }),
      new ForbiddenError('Your account is not active.')
    );
  });

  it('throws an error if user is blocked', async () => {
    await assert.rejects(
      generateTokenPair({
        ...userViewStub,
        role: Role.blocked,
      }),
      new ForbiddenError('Your account is blocked.')
    );
  });

  it('properly generates token pair', async () => {
    const currentTimestamp = Math.floor(clockDateStub.getTime() / 1000);

    const result = await generateTokenPair(userViewStub);

    assert.deepStrictEqual(result, {
      authToken: jwtGeneratorTokenStub,
      refreshToken: randomizerStringStub + userViewStub.id + currentTimestamp,
    });
    const refreshToken = await repository.findByToken(result.refreshToken);
    assert.deepStrictEqual(refreshToken, {
      token: result.refreshToken,
      userId: userViewStub.id,
      createdAt: clockDateStub,
      expiresAt: new Date(
        (currentTimestamp + REFRESH_TOKEN_EXPIRATION_TIME) * 1000
      ),
    });
  });
});
