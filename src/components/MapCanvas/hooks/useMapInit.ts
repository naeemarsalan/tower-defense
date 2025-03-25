import { useEffect, useState } from "react";
import { tileConfig } from "../../../constants";
import { Level } from "../../../level/Level";

export const useMapInit = (
  mapCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  currentLevel: number
) => {
  const [mapGrid, setMapGrid] = useState<number[][]>([]);

  useEffect(() => {
    const level = new Level(currentLevel);
    const img = new Image();
    img.src = level.background.src;
    img.onload = () => {
      const ctx = mapCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      // Draw the full map image
      ctx.drawImage(
        img,
        0,
        0,
        tileConfig.mapWidth * tileConfig.tileSize,
        tileConfig.mapHeight * tileConfig.tileSize
      );

      // Parse the map
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
  }, [mapCanvasRef, currentLevel]);

  return { mapGrid };
};
