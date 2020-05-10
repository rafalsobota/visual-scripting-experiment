import { BlockSpec, PortSpec } from '../../engine/GraphSpec';
import { useContext, useState, useEffect } from 'react';
import GraphContext from '../GraphContext';
import { getBlock, getPortWires } from '../../engine/selectors';
import EngineContext from '../EngineContext';
import Behavior from '../../engine/Behavior';
import Observable from '../../engine/Observable';

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

export function useBehavior<T extends Behavior>(id: string): T {
  const engine = useContext(EngineContext);
  return engine.getBlock(id)! as T;
}

export function useObservable<T>(observable: Observable<T>): T | undefined {
  const [state, setState] = useState<T>();

  useEffect(() => {
    function listener(newState: T) {
      setState(newState);
    }
    observable.subscribe(listener);
    return () => observable.unsubscribe(listener);
  }, [observable]);

  return state;
}
