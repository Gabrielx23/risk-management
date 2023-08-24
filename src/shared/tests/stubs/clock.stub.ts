import { Clock } from '../../clock';

export const clockDateStub = new Date('2023-08-02T00:00:00.000Z');
export const clockStub =
  (dateToBeReturned = clockDateStub): Clock =>
  () =>
    dateToBeReturned;
