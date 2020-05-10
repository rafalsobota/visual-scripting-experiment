import { BlockSpec } from './GraphSpec';
import Behavior, { Send } from './Behavior';

export default interface BlockPrefab {
  type: string;
  name: string;
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec;
  render(spec: BlockSpec): any; // React Element
  materialize(spec: BlockSpec, send: Send): Behavior;
}
