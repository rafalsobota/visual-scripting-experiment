import Behavior from '../../../engine/Behavior';
import Observable from '../../../engine/Observable';

export default class WidgetRendererBehavior extends Behavior {
  widget = new Observable();

  receive(portName: string, widget: any) {
    this.widget.emit(widget);
  }
}
