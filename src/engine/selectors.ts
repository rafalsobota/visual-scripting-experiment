import { BlockSpec, GraphSpec, PortSpec, WireSpec } from "./GraphSpec";
import WireLine from "./WireLine";

export function getBlock(spec: GraphSpec, id: String): BlockSpec | undefined {
    return spec.blocks.find((b) => b.id === id);
}

export function getPort(spec: GraphSpec, id: String): PortSpec | undefined {
    return spec.blocks.flatMap(b => b.inputPorts.concat(b.outputPorts) ).find((p) => p.id === id);
}

export function getWire(spec: GraphSpec, input: string, output: string): WireSpec | undefined {
    return spec.wires.find(w => w.inputPort === input && w.outputPort === output);
}

export function getWireLines(spec: GraphSpec): WireLine[] {
    var wireLines: WireLine[] = [];

    spec.wires.forEach((w) => {
        const input = getPort(spec, w.inputPort);
        const output = getPort(spec, w.outputPort);
        if (input && output && input.x && input.y && output.x && output.y) {
            wireLines.push({x1: output.x, y1: output.y, x2: input.x, y2: input.y});
        }
    });
    return wireLines;
}

export function getPortWires(spec: GraphSpec, id: string): WireSpec[] {
    return spec.wires.filter(w => w.inputPort === id || w.outputPort === id);
}