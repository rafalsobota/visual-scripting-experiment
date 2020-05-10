import React from 'react';
import BlockPrefab from '../../engine/BlockPrefab';
import { BlockSpec } from '../../engine/GraphSpec';
import Behavior, { Send } from '../../engine/Behavior';
import Block from './Block';

const EmptyBlockPrefab: BlockPrefab = {
  type: 'empty',
  name: 'Empty Block',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      inputPorts: [],
      outputPorts: [],
    };
  },
  render(spec: BlockSpec) {
    return <Block id={spec.id}></Block>;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new Behavior(spec, send);
  },
};

export default EmptyBlockPrefab;
