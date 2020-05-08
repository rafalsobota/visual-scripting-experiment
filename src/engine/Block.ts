import { BlockSpec } from "./GraphSpec";

class Block {
    private spec: BlockSpec;

    public get id(): string { return this.spec.id; }

    constructor(spec: BlockSpec) {
        this.spec = spec;
    }

    serialize(): BlockSpec {
        return this.spec;
    }

    move(x: number, y: number) {
        this.spec.x = x;
        this.spec.y = y;
    }
}

export default Block;