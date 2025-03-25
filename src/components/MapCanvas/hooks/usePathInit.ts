import { useEffect, useState } from "react";
import { findPath, findStartAndEnd } from "../../../utils/findPath";
import { Position } from "../../../types";

export const usePathInit = (mapGrid: number[][]) => {
  const [path, setPath] = useState<Array<Position>>([]);

  useEffect(() => {
    if (!mapGrid.length) return;

    // Find start and end points
    const { start, end } = findStartAndEnd(mapGrid);

    if (!start || !end) {
      console.error("Could not find start or end points on the map");
      return;
    }

    // Find path using A* algorithm
    const path = findPath(mapGrid, start, end);

    if (path.length === 0) {
      console.error("No valid path found between start and end points");
      return;
    }

    setPath(path);
  }, [mapGrid]);

  return { path };
};
