import { BlockSpec } from './GraphSpec';
import Block from './Block';

export default interface BlockPrefab {
  type: string;
  name: string;
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec;
  render(spec: BlockSpec): any; // React Element
  materialize(spec: BlockSpec): Block;
}
