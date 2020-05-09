import { BlockSpec, PortSpec } from '../../engine/GraphSpec';
import { useContext } from 'react';
import GraphContext from '../GraphContext';
import { getBlock, getPortWires } from '../../engine/selectors';

export function useBlock(id: string): BlockSpec | undefined {
  const graph = useContext(GraphContext);
  return getBlock(graph, id);
}

export function useBlockOutputPort(blockId: string, name: string): PortSpec | undefined {
  const block = useBlock(blockId);
  return block?.outputPorts.find((p) => p.name === name);
}

export function useBlockInputPort(blockId: string, name: string): PortSpec | undefined {
  const block = useBlock(blockId);
  return block?.inputPorts.find((p) => p.name === name);
}

export function useBlockUtils(blockId: string): any {
  const graph = useContext(GraphContext);
  const block = getBlock(graph, blockId);
  return {
    isInputPortWired: (name: string) => {
      const port = block?.inputPorts.find((p) => p.name === name)!;
      return getPortWires(graph, port.id!).length > 0;
    },
    isOutputPortWired: (name: string) => {
      const port = block?.outputPorts.find((p) => p.name === name)!;
      return getPortWires(graph, port.id!).length > 0;
    },
  };
}
