import React from 'react';
import BlockPrefab from '../../../engine/BlockPrefab';
import { BlockSpec } from '../../../engine/GraphSpec';
import Behavior, { Send } from '../../../engine/Behavior';
import TextLengthValidatorBlock from './TextLengthValidatorBlock';
import TextLengthValidatorBehavior from './TextLengthValidatorBehavior';

const TextLengthValidatorPrefab: BlockPrefab = {
  type: 'text-length-validator',
  name: 'Text Length Validator',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      inputPorts: [{ name: 'text', payloadType: 'string' }],
      outputPorts: [{ name: 'valid', payloadType: 'boolean' }],
    };
  },
  render(spec: BlockSpec) {
    return <TextLengthValidatorBlock id={spec.id} />;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new TextLengthValidatorBehavior(spec, send);
  },
};

export default TextLengthValidatorPrefab;
