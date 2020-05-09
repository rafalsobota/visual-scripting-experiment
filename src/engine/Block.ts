import { BlockSpec } from './GraphSpec';
import { EventEmitter } from 'events';

class Block {
  protected spec: BlockSpec;
  public emitter: EventEmitter;

  public get id(): string {
    return this.spec.id;
  }

  constructor(spec: BlockSpec) {
    this.spec = spec;
    this.emitter = new EventEmitter();
  }

  serialize(): BlockSpec {
    return this.spec;
  }

  move(x: number, y: number) {
    this.spec.x = x;
    this.spec.y = y;
  }

  protected stateChanged() {
    this.emitter.emit('state-changed');
  }

  receive(portId: string, payload: any) {
    // do nothing
  }
}

export default Block;
