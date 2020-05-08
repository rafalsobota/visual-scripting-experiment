import { GraphSpec, BlockSpec, WireSpec } from "./GraphSpec";
import { EventEmitter } from "events";
import {v4 as uuid} from 'uuid';
import BlockPrefab from "./BlockPrefab";
import Block from "./Block";
import { getPort, getWire } from "./selectors";


export default class GraphEngine {

    private stateChangeEmitter = new EventEmitter();

    private blocks: Block[] = [];
    private wires: WireSpec[] = [];

    private _blocksPrefabs: BlockPrefab[] = [];

    public get blocksPrefabs(): BlockPrefab[] { return this._blocksPrefabs; }

    public getPrefab(type: string): BlockPrefab | undefined {
        return this._blocksPrefabs.find(p => p.type === type);
    }

    public render(block: BlockSpec) {
        return this.getPrefab(block.type)?.render(block);
    }

    private updateState(mutator: ()=>void) {
        mutator();
        const state = this.serialize()
        this.stateChangeEmitter.emit('stateChanged', state);
        console.log("state changed", state);
    }

    public subscribe(f: (state: GraphSpec) => void) {
        this.stateChangeEmitter.addListener('stateChanged', f);
    }

    public unsubscribe(f: (state: GraphSpec) => void) {
        this.stateChangeEmitter.removeListener('stateChanged', f);
    }

    public get state(): GraphSpec {
        return this.serialize();
    }

    private serialize(): GraphSpec {
        return {
            blocks: Object.values(this.blocks).map(n => n.serialize()),
            wires: this.wires,
        }
    }

    public registerPrefab(...prefabs: BlockPrefab[]) {
        prefabs.forEach((prefab) =>{
            if(this._blocksPrefabs.find((p) => p.type === prefab.type)) {
                console.warn(`Prefab of type ${prefab.type} is already registered`);
            } else {
                this._blocksPrefabs.push(prefab);
            }
        });
        return this;
    }

    // Sprawdza czy już istnieje bloczek z podaną nazwą i tworzy nową unikalną
    // jeśli nie istnieje Bloczek to zwraca Bloczek
    // jeśli istnieje Bloczek to zwraca Bloczek 2
    // jeśli istnieje Bloczek 40, to zwraca Bloczek 41
    private createName(baseName: string): string {
        const existing = this.blocks.find(b => b.serialize().name === baseName)
        if (!existing) {
            return baseName;
        }

        const regexp = new RegExp(`^${baseName} (\\d+)$`, 'i');
        const numbers = this.blocks
            .map(b => regexp.exec(b.serialize().name))
            .map(r => !!r && r[1])
            .filter(r => !!r)
            .map(r => Number(r))
            .sort();

        if (numbers.length > 0) {
            const lastNumber = numbers[numbers.length - 1];
            return `${baseName} ${lastNumber + 1}`;
        }

        return `${baseName} 2`;
    }

    public createBlock(type: string, x: number, y: number) {

        const prefab = this._blocksPrefabs.find(p => p.type === type);
        if (prefab) {
            this.updateState(() => {
                const newId = uuid();
                const name = this.createName(prefab.name);
                const spec = prefab.newSpec(newId, type, name, x, y);
                spec.inputPorts.concat(spec.outputPorts).forEach(p => {
                    if (!p.id) {
                        p.id = uuid();
                    }
                })
                const newInstance = prefab.materialize(spec);
                this.blocks.push(newInstance);
                console.log(`Creating ${name} of type ${type} at (${x},${y})`);
            });
        }
    }

    public deleteBlock(id: string) {
        this.updateState(() => {
            this.blocks = this.blocks.filter(b => b.id !== id);
        });
    }

    public moveBlock(id: string, x: number, y: number) {
        this.updateState(() => {
            const existingBlock = this.blocks.find(n => n.id === id);
            if (existingBlock) {
                existingBlock.move(x, y);
                // Move to the end of array to stack on top of other blocks in UI
                const newBlocks = this.blocks.filter(n => n.id !== id);
                newBlocks.push(existingBlock);
                this.blocks = newBlocks;
            }

        });
    }

    public setPortPosition(id: String, x: number, y: number) {
        const port = getPort(this.serialize(), id);
        if (port) {
            if (port.x === x && port.y === y) return;
            this.updateState(() => {        
                    port.x = x;
                    port.y = y;
                
            });
        }
    }

    public connectPorts(outputPort: string, inputPort: string) {

        const existingWire = getWire(this.serialize(), inputPort, outputPort);
        if (existingWire) {
            return;
        }

        this.updateState(() => {
            this.wires.push({id: uuid(), inputPort: inputPort, outputPort: outputPort});
        });

        console.log(`connected ${inputPort} -> ${outputPort}`);
    }

}