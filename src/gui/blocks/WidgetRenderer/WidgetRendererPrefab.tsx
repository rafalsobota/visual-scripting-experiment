import React from 'react';
import BlockPrefab from '../../../engine/BlockPrefab';
import { BlockSpec } from '../../../engine/GraphSpec';
import Behavior, { Send } from '../../../engine/Behavior';
import WidgetRendererBlock from './WidgetRendererBlock';
import WidgetRendererBehavior from './WidgetRendererBehavior';

const WidgetRendererPrefab: BlockPrefab = {
  type: 'widget-renderer',
  name: 'Widget Renderer',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      inputPorts: [{ name: 'widget', payloadType: 'widget' }],
      outputPorts: [],
    };
  },
  render(spec: BlockSpec) {
    return <WidgetRendererBlock id={spec.id} />;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new WidgetRendererBehavior(spec, send);
  },
};

export default WidgetRendererPrefab;
