interface Position {
  x: number;
  y: number;
}

interface Node {
  position: Position;
  g: number; // Cost from start to current node
  h: number; // Estimated cost from current node to end
  f: number; // Total cost (g + h)
  parent: Node | null;
}

function manhattan(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function getNeighbors(pos: Position, grid: number[][]): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
  ];

  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    // Check bounds
    if (
      newX >= 0 &&
      newX < grid[0].length &&
      newY >= 0 &&
      newY < grid.length &&
      grid[newY][newX] === 1 // Check if it's a path tile
    ) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
}

export function findPath(
  grid: number[][],
  start: Position,
  end: Position
): Position[] {
  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  // Create start node
  const startNode: Node = {
    position: start,
    g: 0,
    h: manhattan(start, end),
    f: manhattan(start, end),
    parent: null,
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f cost
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }
    const current = openSet[currentIndex];

    // If we reached the end
    if (current.position.x === end.x && current.position.y === end.y) {
      const path: Position[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node.position);
        node = node.parent;
      }
      return path;
    }

    // Move current node from open to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.position.x},${current.position.y}`);

    // Check neighbors
    const neighbors = getNeighbors(current.position, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattan(neighbor, end);
      const f = g + h;

      // Check if neighbor is already in open set
      const openNode = openSet.find(
        (node) =>
          node.position.x === neighbor.x && node.position.y === neighbor.y
      );

      if (!openNode) {
        // Add new node to open set
        openSet.push({
          position: neighbor,
          g,
          h,
          f,
          parent: current,
        });
      } else if (g < openNode.g) {
        // Update existing node if we found a better path
        openNode.g = g;
        openNode.f = f;
        openNode.parent = current;
      }
    }
  }

  // No path found
  return [];
}

export function findStartAndEnd(grid: number[][]): {
  start: Position | null;
  end: Position | null;
} {
  let start: Position | null = null;
  let end: Position | null = null;

  // Find leftmost path tile in the first row for start
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[0][x] === 1) {
      start = { x, y: 0 };
      break;
    }
  }

  // Find rightmost path tile in the last row for end
  const lastRow = grid.length - 1;
  for (let x = grid[0].length - 1; x >= 0; x--) {
    if (grid[lastRow][x] === 1) {
      end = { x, y: lastRow };
      break;
    }
  }

  return { start, end };
}
