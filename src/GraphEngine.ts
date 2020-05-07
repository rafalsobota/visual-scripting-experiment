import { GraphSpec, BlockSpec } from "./GraphSpec";
import { EventEmitter } from "events";
import {v4 as uuid} from 'uuid';


export class GraphEngine {

    // private spec: GraphSpec;
    private stateChangeEmitter = new EventEmitter();

    private nodes: Block[] = [];

    private lastIndex: number = 0;

    constructor() {
    }

    private updateState(updateor: ()=>void) {
        updateor();
        this.stateChangeEmitter.emit('stateChanged', this.serialize());
    }

    subscribe(f: (state: GraphSpec) => void) {
        this.stateChangeEmitter.addListener('stateChanged', f);
    }

    unsubscribe(f: (state: GraphSpec) => void) {
        this.stateChangeEmitter.removeListener('stateChanged', f);
    }

    public get state(): GraphSpec {
        return this.serialize();
    }

    private serialize(): GraphSpec {
        return {
            nodes: Object.values(this.nodes).map(n => n.serialize())
        }
    }

    createNode(type: string, x: number, y: number) {
        this.updateState(() => {
            const newId = uuid();
            const name = `Node ${++this.lastIndex}`;
            this.nodes.push(new Block(newId, name, type, x, y));
            console.log(`Creating ${type} at (${x},${y})`);
        });
        
    }

    moveNode(id: string, x: number, y: number) {
        this.updateState(() => {

            const existingBlock = this.nodes.find(n => n.id === id);
            if (existingBlock) {
                existingBlock.move(x, y);
                const newBlocks = this.nodes.filter(n => n.id !== id);
                newBlocks.push(existingBlock);
                this.nodes = newBlocks;
            }

        });
    }

}

class Block {

    private _id: string;
    private name: string;
    private type: string;
    private x: number;
    private y: number;

    public get id(): string { return this._id; }

    constructor(id: string, name: string, type: string, x: number, y: number) {
        this._id = id;
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    serialize(): BlockSpec {
        return {id: this._id, name: this.name, x: this.x, y: this.y};
    }
}