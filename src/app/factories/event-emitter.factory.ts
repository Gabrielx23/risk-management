import { EventEmitter as NativeEventEmitter } from 'events';

import { EventEmitter } from '../../shared/events/event-emitter';
import { Logger } from '../../shared/logger';

export const createEventEmitter = (logger: Logger): EventEmitter => {
  const eventEmitter = new NativeEventEmitter();
  const nativeEmit = eventEmitter.emit;

  eventEmitter.emit = (eventName: string, ...args: any[]): boolean => {
    logger.debug(
      `Event ${eventName} has been emitted: ${
        args.length ? JSON.stringify(args) : ''
      }`
    );

    return nativeEmit.call(eventEmitter, eventName, ...args);
  };

  return eventEmitter;
};
