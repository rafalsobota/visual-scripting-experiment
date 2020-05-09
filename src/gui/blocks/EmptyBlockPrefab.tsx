import React from 'react';
import BlockPrefab from '../../engine/BlockPrefab';
import { BlockSpec } from '../../engine/GraphSpec';
import EmptyBlock from './EmptyBlock';
import Block from '../../engine/Block';

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
    return <EmptyBlock id={spec.id}></EmptyBlock>;
  },
  materialize(spec: BlockSpec): Block {
    return new Block(spec);
  },
};

export default EmptyBlockPrefab;
