import React from 'react';
import BlockPrefab from '../../engine/BlockPrefab';
import { BlockSpec } from '../../engine/GraphSpec';
import Block from '../../engine/Block';
import TextPrinterBlock from './TextPrinterBlock';

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
            inputPorts: [{name: 'in', payloadType: 'string'}]
        }
    },
    render(spec: BlockSpec) {
        return <TextPrinterBlock id={spec.id}></TextPrinterBlock>
    },
    materialize(spec: BlockSpec): Block {
        return new Block(spec);
    }
}

export default TextPrinterBlockPrefab;