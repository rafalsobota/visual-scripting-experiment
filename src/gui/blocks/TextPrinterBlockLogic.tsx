import Block from '../../engine/Block';

export default class TextPrinterBlockLogic extends Block {
  public subscribe(f: (value: string) => void) {
    this.emitter.addListener('log', f);
  }

  public unsubscribe(f: (value: string) => void) {
    this.emitter.removeListener('log', f);
  }

  receive(portId: string, payload: any) {
    this.emitter.emit('log', payload);
  }
}
