import { GraphSpec, BlockSpec, WireSpec } from './GraphSpec';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import BlockPrefab from './BlockPrefab';
import Behavior from './Behavior';
import { getPort, getWire, getWireLines } from './selectors';
import NavMesh from 'navmesh';
import WireLine from './WireLine';
import { createNavMesh, blockSpecToRect, Rect, rectToPointsList, WiresNavMesh } from './WiresMesh';

export default class GraphEngine {
  private stateChangeEmitter = new EventEmitter();

  private blocks: Behavior[] = []; // dla kolejności wyświetlania jednego na drugim
  private blocksById: { [id: string]: Behavior } = {};
  private wiresByOutputPort: { [inputPort: string]: WireSpec[] } = {}; // do szukania odbiorcy eventu

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

  private updateState(mutator?: () => void) {
    if (mutator) {
      mutator();
    }
    const state = this.serialize();
    this.stateChangeEmitter.emit('stateChanged', state);
    console.log('state changed', state, mutator);
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
      wires: Object.values(this.wiresByOutputPort).flat(),
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
    const existing = Object.values(this.blocksById).find((b) => b.serialize().name === baseName);
    if (!existing) {
      return baseName;
    }

    const regexp = new RegExp(`^${baseName} (\\d+)$`, 'i');
    const numbers = Object.values(this.blocksById)
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
            p.id = `${newId}/${p.name}`;
          }
        });
        const newInstance = prefab.materialize(spec, (portName, payload) => {
          this.receive(newId, portName, payload);
        });
        this.blocksById[newId] = newInstance;
        this.blocks.push(newInstance);
        console.log(`Creating ${name} of type ${type} at (${x},${y})`);
        this.scheduleRecalculationOfWires();
      });
    }
  }

  private receive(blockId: string, portName: string, payload: any): void {
    const wires = this.wiresByOutputPort[`${blockId}/${portName}`] || [];
    wires.forEach((w) => {
      const [blockId, inputPortName] = w.inputPort.split('/');
      const block = this.blocksById[blockId];
      if (!block) return;
      block.receive(inputPortName, payload);
    });
  }

  public deleteBlock(id: string) {
    const block = this.blocksById[id];
    if (!block) return;
    this.updateState(() => {
      const blockSpec = block.serialize();

      blockSpec.outputPorts.forEach((p) => {
        delete this.wiresByOutputPort[`${id}/${p.name}`];
      });

      const inputPortsIds = blockSpec.inputPorts.map((p) => p.id);

      for (const key in this.wiresByOutputPort) {
        this.wiresByOutputPort[key] = this.wiresByOutputPort[key].filter((w) => !inputPortsIds.includes(w.inputPort));
      }
      delete this.blocksById[id];
      this.blocks = this.blocks.filter((b) => b.id !== id);
      this.scheduleRecalculationOfWires();
    });
  }

  public moveBlock(id: string, x: number, y: number) {
    const block = this.blocksById[id];
    if (!block) return;
    if (block) {
      this.updateState(() => {
        block.move(x, y);
        // Move to the end of array to stack on top of other blocks in UI
        const newBlocks = this.blocks.filter((n) => n.id !== id);
        newBlocks.push(block);
        this.blocks = newBlocks;
        this.scheduleRecalculationOfWires();
      });
    }
  }

  public setPortPosition(id: string, x: number, y: number) {
    const port = getPort(this.serialize(), id);
    if (port) {
      if (port.x === x && port.y === y) return;
      console.log('setPortPosition');
      port.x = x;
      port.y = y;
      this.scheduleRecalculationOfWires();
    }
  }

  public connectPorts(outputPort: string, inputPort: string) {
    const existingWire = getWire(this.serialize(), inputPort, outputPort);
    if (existingWire) return;
    // this.updateState(() => {
    if (!this.wiresByOutputPort[outputPort]) {
      this.wiresByOutputPort[outputPort] = [];
    }
    this.wiresByOutputPort[outputPort].push({
      id: uuid(),
      inputPort: inputPort,
      outputPort: outputPort,
    });
    this.scheduleRecalculationOfWires();
    // });

    console.log(`connected ${inputPort} -> ${outputPort}`);
  }

  public deleteWire(id: string) {
    this.updateState(() => {
      for (const key in this.wiresByOutputPort) {
        this.wiresByOutputPort[key] = this.wiresByOutputPort[key].filter((w) => w.id !== id);
      }
      this.scheduleRecalculationOfWires();
    });
  }

  public getBlock(id: string): Behavior | undefined {
    return this.blocksById[id];
  }

  private needsCalculateWires = false;

  private scheduleRecalculationOfWires() {
    if (!this.needsCalculateWires) {
      this.needsCalculateWires = true;
    }
    setTimeout(
      (() => {
        this.needsCalculateWires = false;
        this.recalculateWires();
      }).bind(this),
      0,
    );
  }

  public wiresPaths: WirePath[] = [];

  public navMesh: Rect[] = [];

  private recalculateWires() {
    console.log('recalculateWires');
    const meshPolygonPoints: [Point, Point, Point, Point][] = [];
    this.blocks.forEach((b) => {
      const spec = b.serialize();
      if (spec.x && spec.y && spec.width && spec.height) {
        meshPolygonPoints.push([
          { x: spec.x - 2, y: spec.y - 2 },
          { x: spec.x + spec.width + 2, y: spec.y - 2 },
          { x: spec.x + spec.width + 2, y: spec.y + spec.height + 2 },
          { x: spec.x - 2, y: spec.y + spec.height + 2 },
        ]);
      }
    });

    console.log('polygons', meshPolygonPoints);

    // const navMesh = new NavMesh(meshPolygonPoints);

    // const blockObstacles = this.blocks.map((b) => blockSpecToRect(b.serialize())).filter((b) => !!b) as Rect[];
    const canvas = { x: 0, y: 0, x2: 2000, y2: 2000 };

    const wiresNavMesh = new WiresNavMesh(canvas);
    wiresNavMesh.addBlocks(this.blocks);

    console.log('my nav mesh', this.navMesh);

    // const navMesh = new NavMesh(this.navMesh.map(rectToPointsList));

    const wireLines = getWireLines(this.serialize()).sort((a, b) => {
      // najpierw te, które prowadzą od lewej do prawej
      if (a.x1 < a.x2 && b.x1 > b.x2) return -1;
      if (a.x1 > a.x2 && b.x1 < b.x2) return 1;
      // najpierw krótsze
      return this.wirelineDistance(a) < this.wirelineDistance(b) ? -1 : 1;
    });

    const newWiresPaths: WirePath[] = [];

    wireLines.forEach((w) => {
      const wirePath = wiresNavMesh.addWire(w.id, { x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 });

      if (wirePath) {
        newWiresPaths.push(wirePath);
      } else {
        newWiresPaths.push({ id: w.id, path: [] });
      }
    });

    this.wiresPaths = newWiresPaths;

    this.navMesh = wiresNavMesh.mesh;

    // console.log('wireLines', newWireLines);

    // console.log(navMesh, navMesh.findPath);

    // this.wiresPaths = wireLines.map((w) => {
    //   const navMeshPath = navMesh.findPath({ x: w.x1 + 20, y: w.y1 }, { x: w.x2 - 20, y: w.y2 });

    //   console.log('navMeshPath', navMeshPath);
    //   if (!navMeshPath) {
    //     console.log('navMeshPath is null');
    //     return { id: w.id, path: [] };
    //   }

    //   const path = [{ x: w.x1, y: w.y1 }, ...navMeshPath, { x: w.x2, y: w.y2 }];
    //   return { id: w.id, path };
    // });
    this.updateState();
  }

  private wirelineDistance(w: WireLine): number {
    return Math.sqrt(Math.pow(w.y2 - w.y1, 2) + Math.pow(w.x2 - w.x1, 2));
  }

  public setBlockSize(id: string, width: number, height: number) {
    const block = this.blocksById[id];
    if (!block) return;
    const blockSpec = block.serialize();
    if (blockSpec.width === width && blockSpec.height === height) return;
    block.setSize(width, height);
    console.log('setBlockSize');
    this.scheduleRecalculationOfWires();
  }
}

type Point = { x: number; y: number };

type Line = Point[];

export type WirePath = { id: string; path: Line };
