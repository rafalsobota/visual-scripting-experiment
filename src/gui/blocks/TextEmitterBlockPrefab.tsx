import React from 'react';
import BlockPrefab from '../../engine/BlockPrefab';
import { BlockSpec } from '../../engine/GraphSpec';
import Block from '../../engine/Block';
import TextEmitterBlock from './TextEmitterBlock';

const TextEmitterBlockPrefab: BlockPrefab = {
  type: 'text-emitter',
  name: 'Text Emitter',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      outputPorts: [{ name: 'out', payloadType: 'string' }, { name: 'out2', payloadType: 'string' }],
      inputPorts: [],
    };
  },
  render(spec: BlockSpec) {
    return <TextEmitterBlock id={spec.id}></TextEmitterBlock>;
  },
  materialize(spec: BlockSpec): Block {
    return new Block(spec);
  },
};

export default TextEmitterBlockPrefab;
