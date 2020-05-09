import { BlockSpec, GraphSpec, PortSpec, WireSpec } from "./GraphSpec";
import WireLine from "./WireLine";

export function getBlock(spec: GraphSpec, id: String): BlockSpec | undefined {
  return spec.blocks.find((b) => b.id === id);
}

export function getPort(spec: GraphSpec, id: String): PortSpec | undefined {
  return spec.blocks.flatMap(({ inputPorts, outputPorts }) => [...inputPorts, ...outputPorts]).find((p) => p.id === id);
}

export function getWire(spec: GraphSpec, input: string, output: string): WireSpec | undefined {
  return spec.wires.find(({ inputPort, outputPort }) => inputPort === input && outputPort === output);
}

export function getWireLines(spec: GraphSpec): WireLine[] {
  const wireLines: WireLine[] = [];

  spec.wires.forEach(({ inputPort, outputPort }) => {
    const input = getPort(spec, inputPort);
    const output = getPort(spec, outputPort);
    if (input?.x && input.y && output?.x && output?.y) {
      wireLines.push({ x1: output.x, y1: output.y, x2: input.x, y2: input.y });
    }
  });
  return wireLines;
}
