export interface GraphSpec {
    blocks: BlockSpec[]
    // wires: WireSpec[]
}

export interface BlockSpec {
    id: string // GUID żeby dało się merdżować zmiany w gicie
    name: string
    type: string
    // inputPorts: PortSpec[]
    // outputPorts: PortSpec[]
    // settings: any // place for block extensions
    x: number
    y: number
    // width: number
    // height: number
}

export interface PortSpec {
    id: string // GUID
    payloadType: 'string' | 'boolean' | 'number'
    name: string
}

export interface WireSpec {
    id: string // GUID
    outputPort: string
    inputPort: string
}