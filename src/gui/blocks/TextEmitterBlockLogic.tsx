import Behavior from '../../engine/Behavior';

export default class TextEmitterBlockLogic extends Behavior {
  value = '';

  setValue(value: string) {
    this.value = value;
  }

  emit() {
    this.send('out', this.value);
  }
}
