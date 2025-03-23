import { useEffect, useRef } from "react";
import { tileConfig } from "../constants";
import { Position } from "../types";
import { Game } from "../game/Game";

interface Props {
  path: Position[];
  game: Game;
}

export const CharacterCanvas = ({ path, game }: Props) => {
  const charCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!path.length) return;

    const canvas = charCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    (() => {
      function main() {
        setTimeout(() => {
          window.requestAnimationFrame(main);
          game.tick(ctx);
        }, 1000 / game.FPS);
      }
      main(); // Start the cycle
    })();
  }, [path, game]);

  return (
    <canvas
      ref={charCanvasRef}
      width={tileConfig.mapWidth * tileConfig.tileSize}
      height={tileConfig.mapHeight * tileConfig.tileSize}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
};
