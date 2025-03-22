import { useEffect, useRef } from "react";
import { tileConfig } from "../constants";
import { Position } from "../types";
import { Game } from "../game/Game";

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

    const fps = 16;
    const frameInterval = 1000 / fps;

    const game = new Game(path);

    const animate = () => {
      // Clear previous frame to prevent ghost images
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      game.tick(ctx);

      // Schedule next animation frame
      // frameInterval = 1000/fps to maintain consistent animation speed
      setTimeout(animate, frameInterval);
    };

    animate();
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
