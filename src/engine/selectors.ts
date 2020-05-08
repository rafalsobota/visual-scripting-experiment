import { BlockSpec, GraphSpec } from "./GraphSpec";

export function getBlock(spec: GraphSpec, id: String): BlockSpec | undefined {
    return spec.blocks.find((b) => b.id === id);
}