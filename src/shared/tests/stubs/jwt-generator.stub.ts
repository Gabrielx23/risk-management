import { Jwt } from '../../jwt';

export const jwtGeneratorTokenStub =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
export const jwtGeneratorTokenPayloadStub = {
  data: {
    name: 'John Doe',
  },
  sub: '1234567890',
  iat: 1516239022,
};

export const jwtGeneratorStub = (
  jwtToBeReturned = jwtGeneratorTokenStub,
  decodedPayloadToBeReturned = jwtGeneratorTokenPayloadStub
): Jwt => ({
  sign: (): string => jwtToBeReturned,
  verify: <PayloadT>(): PayloadT | null =>
    decodedPayloadToBeReturned as PayloadT,
});
