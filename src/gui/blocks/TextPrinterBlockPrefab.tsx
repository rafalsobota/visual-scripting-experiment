import React from 'react';
import BlockPrefab from '../../engine/BlockPrefab';
import { BlockSpec } from '../../engine/GraphSpec';
import Behavior, { Send } from '../../engine/Behavior';
import TextPrinterBlock from './TextPrinterBlock';
import TextPrinterBlockLogic from './TextPrinterBlockLogic';

const TextPrinterBlockPrefab: BlockPrefab = {
  type: 'text-printer',
  name: 'Text Printer',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      outputPorts: [],
      inputPorts: [{ name: 'in', payloadType: 'string' }],
    };
  },
  render(spec: BlockSpec) {
    return <TextPrinterBlock id={spec.id}></TextPrinterBlock>;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new TextPrinterBlockLogic(spec, send);
  },
};

export default TextPrinterBlockPrefab;
