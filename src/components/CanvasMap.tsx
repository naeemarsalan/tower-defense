import { useEffect, useRef, useState } from "react";

interface TileConfig {
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
}

export const CanvasMap = () => {
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const charCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mapGrid, setMapGrid] = useState<number[][]>([]);
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);

  const tileConfig: TileConfig = {
    tileSize: 70,
    mapWidth: 12,
    mapHeight: 12,
  };

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
  }, [tileConfig.mapHeight, tileConfig.mapWidth, tileConfig.tileSize]);

  useEffect(() => {
    if (!mapGrid.length) return;

    const path = [];

    for (let y = 0; y < mapGrid.length; y++) {
      for (let x = 0; x < mapGrid[y].length; x++) {
        if (mapGrid[y][x] === 1) {
          path.push({ x, y });
        }
      }
    }

    setPath(path);
  }, [mapGrid]);

  useEffect(() => {
    const frameWidth = 64; // Adjust to your sprite's frame size
    const frameHeight = 64;
    const totalFrames = 6; // Example: 6 frames per walk cycle

    const canvas = charCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = new Image();
    sprite.src = "/Vampires1_Walk_full.png";

    let frame = 0;
    let pathIndex = 0;
    const fps = 16;
    const frameInterval = 1000 / fps;

    sprite.onload = () => {
      let progress = 0; // Track progress between tiles (0-1)
      const moveSpeed = 0.05; // Adjust for faster/slower movement

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentPosition = path[pathIndex];
        const nextPosition = path[Math.min(pathIndex + 1, path.length - 1)];

        if (!currentPosition || !nextPosition) return;

        // Determine sprite row based on movement direction
        let spriteRow = 0; // Default face down
        if (nextPosition.x > currentPosition.x) {
          spriteRow = 3; // Face right
        } else if (nextPosition.x < currentPosition.x) {
          spriteRow = 2; // Face left
        } else if (nextPosition.y > currentPosition.y) {
          spriteRow = 0; // Face down
        } else if (nextPosition.y < currentPosition.y) {
          spriteRow = 1; // Face up
        }

        // Interpolate between current and next tile positions
        const posX =
          (currentPosition.x * (1 - progress) + nextPosition.x * progress) *
          tileConfig.tileSize;
        const posY =
          (currentPosition.y * (1 - progress) + nextPosition.y * progress) *
          tileConfig.tileSize;

        // Draw current vampire frame with correct direction
        ctx.drawImage(
          sprite,
          frame * frameWidth,
          spriteRow * frameHeight, // Use spriteRow to select correct animation row
          frameWidth,
          frameHeight,
          posX,
          posY,
          frameWidth,
          frameHeight
        );

        // Update animation frame
        frame = (frame + 1) % totalFrames;

        // Update position progress
        progress += moveSpeed;

        // Move to next path tile when reaching destination
        if (progress >= 1) {
          progress = 0;
          pathIndex = Math.min(pathIndex + 1, path.length - 1);
        }

        setTimeout(animate, frameInterval);
      };

      animate();
    };
  }, [path, tileConfig.tileSize]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={mapCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ border: "1px solid black" }}
      />
      <canvas
        ref={charCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};
