import { EventEmitter } from 'events';

export default class Observable<T> {
  protected emitter = new EventEmitter();
  subscribe(f: (value: T) => void) {
    this.emitter.on('changed', f);
  }
  unsubscribe(f: (value: T) => void) {
    this.emitter.off('changed', f);
  }
  emit(value: T): void {
    this.emitter.emit('changed', value);
  }
}
