export interface EventEmitter {
  on(eventName: string, cb: (...args: any[]) => Promise<void>): void;
  emit(eventName: string, payload: unknown): void;
}
