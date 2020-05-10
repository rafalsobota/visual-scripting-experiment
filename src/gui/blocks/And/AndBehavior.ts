import Behavior from '../../../engine/Behavior';

export default class AndBehavior extends Behavior {
  a = false;
  b = false;

  receive(portName: string, value: boolean) {
    if (portName === 'a') {
      this.a = value;
    } else if (portName === 'b') {
      this.b = value;
    }

    this.send('result', this.a && this.b);
  }
}
