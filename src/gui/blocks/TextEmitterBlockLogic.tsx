import Block from '../../engine/Block';

export default class TextEmitterBlockLogic extends Block {
  value = '';

  setValue(value: string) {
    this.value = value;
  }

  emit() {
    this.send('out', this.value);
  }
}
