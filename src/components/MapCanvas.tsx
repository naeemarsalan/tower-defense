import { useEffect, useRef, useState } from "react";
import { tileConfig } from "../constants";
import { CharacterCanvas } from "./CharacterCanvas";
import { findPath, findStartAndEnd } from "../utils/findPath";

export const MapCanvas = () => {
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mapGrid, setMapGrid] = useState<number[][]>([]);
  const [monsterPath, setMonsterPath] = useState<{ x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    const img = new Image();
    img.src = "/map.png";
    img.onload = () => {
      const ctx = mapCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      // ✅ Draw the full map image
      ctx.drawImage(
        img,
        0,
        0,
        tileConfig.mapWidth * tileConfig.tileSize,
        tileConfig.mapHeight * tileConfig.tileSize
      );

      // ✅ Parse the map
      const parsedMap: number[][] = [];
      for (let y = 0; y < tileConfig.mapHeight; y++) {
        const row: number[] = [];
        for (let x = 0; x < tileConfig.mapWidth; x++) {
          // Sample center pixel of the tile
          const pixelX = x * tileConfig.tileSize + tileConfig.tileSize / 2;
          const pixelY = y * tileConfig.tileSize + tileConfig.tileSize / 2;

          const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
          const [r] = pixelData;

          // Simple color check logic - adjust thresholds as needed
          if (r < 100) {
            row.push(1);
          } else {
            row.push(0);
          }
        }
        parsedMap.push(row);
      }

      setMapGrid(parsedMap);
    };
  }, []);

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

    setMonsterPath(path);
  }, [mapGrid]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={mapCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ border: "1px solid black" }}
      />

      <CharacterCanvas path={monsterPath} />
    </div>
  );
};
