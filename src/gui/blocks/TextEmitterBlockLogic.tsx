import Block from '../../engine/Block';

export default class TextEmitterBlockLogic extends Block {
  setValue(value: string) {
    if (!this.spec.settings) {
      this.spec.settings = {};
    }
    this.spec.settings.value = value;
  }

  emit() {
    if (!this.spec.settings?.value) return;

    const outputPortId = this.spec.outputPorts[0].id!;
    this.emitter.emit('event', {
      port: outputPortId,
      payload: this.spec.settings.value,
    });
  }
}
