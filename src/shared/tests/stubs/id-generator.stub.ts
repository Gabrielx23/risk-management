import { IdGenerator } from '../../uuid';

export const idGeneratorUuidStub = '200db642-a014-46dc-b678-fc2777b4b301';
export const idGeneratorStub =
  (uuidToBeReturned = idGeneratorUuidStub): IdGenerator =>
  () =>
    uuidToBeReturned;
