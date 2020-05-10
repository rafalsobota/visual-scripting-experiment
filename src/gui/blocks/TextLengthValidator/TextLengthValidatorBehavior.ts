import Behavior from '../../../engine/Behavior';

export default class TextLengthValidatorBehavior extends Behavior {
  start() {
    if (!this.spec.settings) {
      this.spec.settings = {};
    }
  }

  lastValue: string | undefined;

  public setMin(length: number | undefined) {
    this.spec.settings.minLength = length;
    if (this.lastValue) {
      this.send('valid', this.validate(this.lastValue));
    }
  }

  public setMax(length: number | undefined) {
    this.spec.settings.maxLength = length;
    if (this.lastValue) {
      this.send('valid', this.validate(this.lastValue));
    }
  }

  private validate(text: string): boolean {
    let valid = true;

    if (this.spec.settings.minLength !== undefined) {
      if (text.length < this.spec.settings.minLength) {
        valid = false;
      }
    }

    if (this.spec.settings.maxLength !== undefined) {
      if (text.length > this.spec.settings.maxLength) {
        valid = false;
      }
    }

    return valid;
  }

  receive(portName: string, text: string) {
    this.lastValue = text;
    this.send('valid', this.validate(this.lastValue));
  }
}
