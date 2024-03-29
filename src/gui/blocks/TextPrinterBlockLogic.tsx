import Behavior from '../../engine/Behavior';
import { EventEmitter } from 'events';

export default class TextPrinterBlockLogic extends Behavior {
  widgetEmitter: EventEmitter = new EventEmitter();

  public subscribe(f: (value: string) => void) {
    this.widgetEmitter.addListener('log', f);
  }

  public unsubscribe(f: (value: string) => void) {
    this.widgetEmitter.removeListener('log', f);
  }

  receive(portName: string, payload: any) {
    this.widgetEmitter.emit('log', payload);
  }
}
