import { BlockSpec } from './GraphSpec';

export type Send = (portName: string, payload: any) => void;

class Behavior {
  protected spec: BlockSpec;
  protected send: Send;

  public get id(): string {
    return this.spec.id;
  }

  // called by engine
  constructor(spec: BlockSpec, send: Send) {
    this.spec = spec;
    this.send = send;
    this.start();
  }

  start(): void {
    // override
  }

  serialize(): BlockSpec {
    return this.spec;
  }

  move(x: number, y: number) {
    this.spec.x = x;
    this.spec.y = y;
  }

  receive(portName: string, payload: any): void {
    // override;
  }
}

export default Behavior;
