import { GraphSpec, BlockSpec } from "./GraphSpec";
import { EventEmitter } from "events";
import {v4 as uuid} from 'uuid';
import BlockPrefab from "./BlockPrefab";
import Block from "./Block";


export class GraphEngine {

    private stateChangeEmitter = new EventEmitter();

    private blocks: Block[] = [];

    private lastIndex: {[type: string]: number} = {};

    private getNewIndex(type: string): number {
        if (this.lastIndex[type] === undefined) {
            this.lastIndex[type] = 0
        }
        return ++this.lastIndex[type];
    }

    private _blocksPrefabs: BlockPrefab[] = [];

    public get blocksPrefabs(): BlockPrefab[] { return this._blocksPrefabs; }

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
            blocks: Object.values(this.blocks).map(n => n.serialize())
        }
    }

    registerPrefab(...prefabs: BlockPrefab[]) {
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

    createBlock(type: string, x: number, y: number) {

        const prefab = this._blocksPrefabs.find(p => p.type === type);
        if (prefab) {
            this.updateState(() => {
                const newId = uuid();
                const name = this.createName(prefab.name);

                const spec = prefab.newSpec(newId, type, name, x, y);
                const newInstance = prefab.materialize(spec);
                this.blocks.push(newInstance);
                console.log(`Creating ${name} of type ${type} at (${x},${y})`);
            });
        }
    }

    moveBlock(id: string, x: number, y: number) {
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

}