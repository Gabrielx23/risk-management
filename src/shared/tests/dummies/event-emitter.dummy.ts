import { EventEmitter } from '../../events/event-emitter';

export const eventEmitterDummy: EventEmitter = {
  on: (_eventName: string, _cb: (payload: unknown) => Promise<void>) => {},
  emit: (_eventName: string, _payload: unknown) => {},
};
