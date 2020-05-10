import React from 'react';
import BlockPrefab from '../../../engine/BlockPrefab';
import { BlockSpec } from '../../../engine/GraphSpec';
import Behavior, { Send } from '../../../engine/Behavior';
import Block from '../Block';
import AndBehavior from './AndBehavior';

const AndPrefab: BlockPrefab = {
  type: 'and',
  name: 'And',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      inputPorts: [
        { name: 'a', payloadType: 'boolean' },
        { name: 'b', payloadType: 'boolean' },
      ],
      outputPorts: [{ name: 'result', payloadType: 'boolean' }],
    };
  },
  render(spec: BlockSpec) {
    return <Block id={spec.id} />;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new AndBehavior(spec, send);
  },
};

export default AndPrefab;
