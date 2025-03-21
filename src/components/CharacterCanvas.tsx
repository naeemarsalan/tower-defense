import { useEffect, useRef } from "react";
import { Vampire } from "../vampire/Vampire";
import { tileConfig } from "../constants";
import { Position } from "../types";

interface Props {
  path: Position[];
}

export const CharacterCanvas = ({ path }: Props) => {
  const charCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!path.length) return;

    const canvas = charCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ✅ Start outside the map
    let pathIndex = -1;
    const fps = 16;
    const frameInterval = 1000 / fps;

    const initialPosition =
      pathIndex === -1 ? { x: path[0].x, y: path[0].y - 1 } : path[pathIndex];

    const vampire = new Vampire(initialPosition);

    vampire.sprite.onload = () => {
      // Progress represents how far we've moved between current tile and next tile (0 = at current tile, 1 = at next tile)
      let progress = 0;
      // How fast the vampire moves between tiles (0.05 = 5% of the distance per frame)
      const moveSpeed = 0.05;

      const animate = () => {
        // Clear previous frame to prevent ghost images
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nextPosition =
          pathIndex === path.length - 1
            ? { x: path[pathIndex].x, y: path[pathIndex].y + 1 }
            : path[Math.min(pathIndex + 1, path.length)];

        // Safety check - stop animation if we don't have valid positions
        if (!nextPosition) return;

        vampire.draw(ctx, nextPosition, progress);

        // Move vampire closer to next tile
        progress += moveSpeed;

        // When we reach the next tile (progress >= 1)
        // Reset progress and move to next tile in path
        if (progress >= 1) {
          progress = 0;
          pathIndex = Math.min(pathIndex + 1, path.length);
          vampire.updatePosition(path[pathIndex]);
        }

        // Schedule next animation frame
        // frameInterval = 1000/fps to maintain consistent animation speed
        setTimeout(animate, frameInterval);
      };

      animate();
    };
  }, [path]);

  return (
    <canvas
      ref={charCanvasRef}
      width={tileConfig.mapWidth * tileConfig.tileSize}
      height={tileConfig.mapHeight * tileConfig.tileSize}
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
};
