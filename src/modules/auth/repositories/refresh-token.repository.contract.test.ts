import assert from 'assert';
import { RefreshTokenRepository, RefreshToken } from '../models/refresh-token';

const refreshTokenStub: RefreshToken = {
  token: 'some-token',
  userId: '200db642-a014-46dc-b678-fc2777b4b301',
  createdAt: new Date('2023-08-02T00:00:00.000Z'),
  expiresAt: new Date('2023-08-02T00:00:00.000Z'),
};

export const refreshTokenRepositoryContractTest = (
  variant: string,
  createRepository: () => RefreshTokenRepository,
  clean: () => Promise<void>,
  prepare: () => Promise<void>
) => {
  describe(`RefreshToken repository contract: ${variant}`, () => {
    let repository: RefreshTokenRepository;

    beforeEach(async () => {
      await clean();
      await prepare();
      repository = createRepository();
    });

    describe('create', () => {
      it('creates refresh token', async () => {
        await repository.create(refreshTokenStub);

        const foundToken = await repository.findByToken(refreshTokenStub.token);
        assert.deepStrictEqual(foundToken, refreshTokenStub);
      });
    });

    describe('delete', () => {
      it('deletes refresh token', async () => {
        await repository.create(refreshTokenStub);
        await repository.delete(refreshTokenStub.token);

        const foundToken = await repository.findByToken(refreshTokenStub.token);
        assert.equal(foundToken, null);
      });
    });
  });
};
