import { BlockSpec } from './GraphSpec';
import NavMesh from 'navmesh';
import Behavior from './Behavior';

export type Rect = {
  x: number;
  y: number;
  x2: number;
  y2: number;
};

export function createNavMesh(canvas: Rect, obstacles: Rect[]): Rect[] {
  let mesh: Rect[] = [canvas];
  obstacles.forEach((o) => {
    mesh = mesh.flatMap((m) => cutMesh(m, o));
  });

  return mesh;
}

function cutMesh(m: Rect, o: Rect): Rect[] {
  if (!(m.x < o.x2 && m.x2 > o.x && m.y < o.y2 && m.y2 > o.y)) {
    // not colliding
    return [{ x: m.x, y: m.y, x2: m.x2, y2: m.y2 }];
  }

  // colliding, let's cut

  const cuttedMesh: Rect[] = [];

  // left
  if (m.x < o.x) {
    cuttedMesh.push({
      x: m.x,
      y: m.y,
      x2: o.x,
      y2: m.y2,
    });
  }

  // top
  if (m.y < o.y) {
    cuttedMesh.push({
      x: Math.max(m.x, o.x),
      y: m.y,
      x2: Math.min(m.x2, o.x2),
      y2: o.y,
    });
  }

  // bottom
  if (m.y2 > o.y2) {
    cuttedMesh.push({
      x: Math.max(m.x, o.x),
      y: o.y2,
      x2: Math.min(m.x2, o.x2),
      y2: m.y2,
    });
  }

  // right
  if (m.x2 > o.x2) {
    cuttedMesh.push({
      x: o.x2,
      y: m.y,
      x2: m.x2,
      y2: m.y2,
    });
  }

  return cuttedMesh;
}

const radius = 10;

export function blockSpecToRect(b: BlockSpec): Rect | undefined {
  if (b.width && b.height) {
    return { x: b.x - radius, y: b.y - radius, x2: b.x + b.width + radius, y2: b.y + b.height + radius };
  }
}

type PointsList = Point[];

export function rectToPointsList(r: Rect): Point[] {
  return [
    { x: r.x, y: r.y },
    { x: r.x2, y: r.y },
    { x: r.x2, y: r.y2 },
    { x: r.x, y: r.y2 },
  ];
}

export class WiresNavMesh {
  mesh: Rect[];

  constructor(canvas: Rect) {
    this.mesh = [canvas];
  }

  addBlocks(blocks: Behavior[]) {
    const blockObstacles = blocks.map((b) => blockSpecToRect(b.serialize())).filter((b) => !!b) as Rect[];
    this.addObstacle(...blockObstacles);
  }

  addObstacle(...obstacles: Rect[]) {
    obstacles.forEach((o) => {
      this.mesh = this.mesh.flatMap((m) => cutMesh(m, o));
    });
  }

  addWire(id: string, origin: Point, destination: Point): WirePath | undefined {
    const navMesh = new NavMesh(this.mesh.map(rectToPointsList));

    const path: Point[] = navMesh.findPath(
      { x: origin.x + 20, y: origin.y },
      { x: destination.x - 20, y: destination.y },
    );

    if (path) {
      if (path.length > 2) {
        const pathObstacles = path.slice(1, path.length - 1);
        pathObstacles.forEach((o) => {
          this.addObstacle({ x: o.x - 3, y: o.y - 3, x2: o.x + 3, y2: o.y + 3 });
        });
      }
      return { id, path: [origin, ...path, destination] };
    }
  }
}

type Point = { x: number; y: number };

type Line = Point[];

export type WirePath = { id: string; path: Line };
