import { GraphSpec, BlockSpec, WireSpec } from './GraphSpec';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import BlockPrefab from './BlockPrefab';
import Block from './Block';
import { getPort, getWire } from './selectors';

export default class GraphEngine {
  private stateChangeEmitter = new EventEmitter();

  private blocks: Block[] = [];
  private wires: WireSpec[] = [];
  private portToBlock: { [portId: string]: Block } = {};

  private _blocksPrefabs: BlockPrefab[] = [];

  public get blocksPrefabs(): BlockPrefab[] {
    return this._blocksPrefabs;
  }

  public getPrefab(type: string): BlockPrefab | undefined {
    return this._blocksPrefabs.find((p) => p.type === type);
  }

  public render(block: BlockSpec) {
    return this.getPrefab(block.type)?.render(block);
  }

  private updateState(mutator: () => void) {
    mutator();
    const state = this.serialize();
    this.stateChangeEmitter.emit('stateChanged', state);
    console.log('state changed', state);
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
      blocks: this.blocks.map((b) => b.serialize()),
      wires: this.wires,
    };
  }

  public registerPrefab(...prefabs: BlockPrefab[]) {
    prefabs.forEach((prefab) => {
      if (this._blocksPrefabs.find((p) => p.type === prefab.type)) {
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
    const existing = this.blocks.find((b) => b.serialize().name === baseName);
    if (!existing) {
      return baseName;
    }

    const regexp = new RegExp(`^${baseName} (\\d+)$`, 'i');
    const numbers = this.blocks
      .map((b) => regexp.exec(b.serialize().name))
      .map((r) => !!r && r[1])
      .filter((r) => !!r)
      .map((r) => Number(r))
      .sort();

    if (numbers.length > 0) {
      const lastNumber = numbers[numbers.length - 1];
      return `${baseName} ${lastNumber + 1}`;
    }

    return `${baseName} 2`;
  }

  public createBlock(type: string, x: number, y: number) {
    const prefab = this._blocksPrefabs.find((p) => p.type === type);
    if (prefab) {
      this.updateState(() => {
        const newId = uuid();
        const name = this.createName(prefab.name);
        const spec = prefab.newSpec(newId, type, name, x, y);
        spec.inputPorts.concat(spec.outputPorts).forEach((p) => {
          if (!p.id) {
            p.id = uuid();
          }
        });
        const newInstance = prefab.materialize(spec);
        this.blocks.push(newInstance);

        newInstance.emitter.on('event', (e) => this.receiveEvent(e));
        newInstance.emitter.on('state-changed', () => this.receiveStateChanged());

        console.log(`Creating ${name} of type ${type} at (${x},${y})`);
      });
    }
  }

  private receiveEvent(e: { port: string; payload: any }) {
    console.log('event', e);
    const { port, payload } = e;
    this.wires
      .filter((w) => w.outputPort === port)
      .forEach((w) => {
        const spec = this.serialize();
        const receiverBlock = spec.blocks.find((b) => !!b.inputPorts.find((p) => p.id === w.inputPort));
        if (receiverBlock) {
          const block = this.blocks.find((b) => b.id === receiverBlock.id);
          block?.receive(w.inputPort, payload);
        }
      });
  }

  private receiveStateChanged() {
    this.updateState(() => {
      // only rerender
    });
  }

  public deleteBlock(id: string) {
    const block = this.blocks.find((b) => b.id === id);
    if (!block) return;
    const blockState = block.serialize();
    this.updateState(() => {
      this.blocks = this.blocks.filter((b) => b.id !== id);
      const ports = blockState.inputPorts.concat(blockState.outputPorts).map((p) => p.id!);
      this.wires = this.wires.filter((w) => !ports.includes(w.inputPort) && !ports.includes(w.outputPort));
    });
  }

  public moveBlock(id: string, x: number, y: number) {
    const existingBlock = this.blocks.find((n) => n.id === id);
    if (existingBlock) {
      this.updateState(() => {
        existingBlock.move(x, y);
        // Move to the end of array to stack on top of other blocks in UI
        const newBlocks = this.blocks.filter((n) => n.id !== id);
        newBlocks.push(existingBlock);
        this.blocks = newBlocks;
      });
    }
  }

  public setPortPosition(id: string, x: number, y: number) {
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
      this.wires.push({
        id: uuid(),
        inputPort: inputPort,
        outputPort: outputPort,
      });
    });

    console.log(`connected ${inputPort} -> ${outputPort}`);
  }

  public deleteWire(id: string) {
    const existingWire = this.wires.find((w) => w.id === id);

    if (!existingWire) return;

    this.updateState(() => {
      this.wires = this.wires.filter((w) => w.id !== id);
    });
  }

  public getBlock(id: string): Block | undefined {
    return this.blocks.find((b) => b.id === id);
  }
}
