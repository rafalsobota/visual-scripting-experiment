export interface GraphSpec {
  blocks: BlockSpec[];
  wires: WireSpec[];
}

export interface BlockSpec {
  id: string; // GUID żeby dało się merdżować zmiany w gicie
  name: string;
  type: string;
  inputPorts: PortSpec[];
  outputPorts: PortSpec[];
  settings?: any; // place for block extensions
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface PortSpec {
  id?: string; // GUID
  name: string; // output ports for particular Block have to be uniq
  payloadType: 'string' | 'boolean' | 'number' | 'widget';
  x?: number;
  y?: number;
}

export interface WireSpec {
  id: string; // GUID
  outputPort: string;
  inputPort: string;
  // inputBlockId: string;
  // inputPortName: string;
  // outputBlockId: string;
  // outputPortName: string;
}
