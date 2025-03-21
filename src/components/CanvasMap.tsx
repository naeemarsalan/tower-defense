import { useEffect, useRef } from "react";

interface TileConfig {
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
}

export const CanvasMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tileConfig: TileConfig = {
    tileSize: 70,
    mapWidth: 12,
    mapHeight: 12,
  };

  useEffect(() => {
    const img = new Image();
    img.src = "/map.png";
    img.onload = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(
        0,
        0,
        tileConfig.mapWidth * tileConfig.tileSize,
        tileConfig.mapHeight * tileConfig.tileSize
      );

      // ✅ Draw the full map image
      ctx.drawImage(
        img,
        0,
        0,
        tileConfig.mapWidth * tileConfig.tileSize,
        tileConfig.mapHeight * tileConfig.tileSize
      );

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

      console.log("Parsed Tile Map (grass/sand):", parsedMap);
    };
  }, [tileConfig.mapHeight, tileConfig.mapWidth, tileConfig.tileSize]);

  return (
    <canvas
      ref={canvasRef}
      width={tileConfig.mapWidth * tileConfig.tileSize}
      height={tileConfig.mapHeight * tileConfig.tileSize}
      style={{ border: "1px solid black" }}
    />
  );
};
