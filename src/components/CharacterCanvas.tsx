import { useEffect, useRef } from "react";
import { Vampire } from "../vampire/Vampire";
import { tileConfig } from "../constants";

interface Props {
  path: { x: number; y: number }[];
}

export const CharacterCanvas = ({ path }: Props) => {
  const charCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = charCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ✅ Animate the vampire
    let currentSpriteFrame = 0;

    // ✅ Start outside the map
    let pathIndex = -1;
    const fps = 16;
    const frameInterval = 1000 / fps;

    const vampire = new Vampire();
    vampire.sprite.onload = () => {
      // Progress represents how far we've moved between current tile and next tile (0 = at current tile, 1 = at next tile)
      let progress = 0;
      // How fast the vampire moves between tiles (0.05 = 5% of the distance per frame)
      const moveSpeed = 0.05;

      const animate = () => {
        if (path.length === 0) return;

        // Clear previous frame to prevent ghost images
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get current tile position and next tile position from the path
        const currentPosition =
          pathIndex === -1
            ? { x: path[0].x, y: path[0].y - 1 }
            : path[pathIndex];

        const nextPosition =
          pathIndex === path.length - 1
            ? { x: path[pathIndex].x, y: path[pathIndex].y + 1 }
            : path[Math.min(pathIndex + 1, path.length)];

        // Safety check - stop animation if we don't have valid positions
        if (!currentPosition || !nextPosition) return;

        // Determine which row of the sprite sheet to use based on movement direction
        // Returns BodyPosition enum value (0=DOWN, 1=UP, 2=LEFT, 3=RIGHT)
        const currentSpriteVariant = vampire.getCurrentSpriteVariant(
          nextPosition,
          currentPosition
        );

        // Calculate smooth position between tiles using linear interpolation (lerp)
        // progress = 0 -> vampire is at currentPosition
        // progress = 1 -> vampire is at nextPosition
        // progress between 0-1 -> vampire is between positions
        const posX =
          (currentPosition.x * (1 - progress) + nextPosition.x * progress) *
          tileConfig.tileSize;

        const posY =
          (currentPosition.y * (1 - progress) + nextPosition.y * progress) *
          tileConfig.tileSize;

        // Draw the vampire sprite:
        // - frame * SPRITE_WIDTH: selects which column (animation frame) from sprite sheet
        // - currentSprite * SPRITE_HEIGHT: selects which row (direction) from sprite sheet
        // - SPRITE_WIDTH/HEIGHT: size of one frame in the sprite sheet
        // - posX/posY: where to draw on the canvas
        ctx.drawImage(
          vampire.sprite, // sprite sheet
          currentSpriteFrame * vampire.SPRITE_WIDTH,
          currentSpriteVariant * vampire.SPRITE_HEIGHT,
          vampire.SPRITE_WIDTH,
          vampire.SPRITE_HEIGHT,
          posX,
          posY,
          vampire.SPRITE_WIDTH,
          vampire.SPRITE_HEIGHT
        );

        // Move to next frame in the walking animation
        // Cycles through frames 0 to TOTAL_FRAMES-1
        currentSpriteFrame = (currentSpriteFrame + 1) % vampire.TOTAL_FRAMES;

        // Move vampire closer to next tile
        progress += moveSpeed;

        // When we reach the next tile (progress >= 1)
        // Reset progress and move to next tile in path
        if (progress >= 1) {
          progress = 0;
          pathIndex = Math.min(pathIndex + 1, path.length);
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
