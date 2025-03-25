import { useCallback } from "react";
import { Game } from "../../../game/Game";
import { tileConfig } from "../../../constants";

interface Args {
  mapGrid: number[][];
  game: Game | null;
  gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const useAddTower = ({ mapGrid, game, gameCanvasRef }: Args) => {
  const addTower = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!game || !gameCanvasRef.current) return false;

      const canvas = gameCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Convert pixel coordinates to grid coordinates
      const gridX = Math.floor(x / tileConfig.tileSize);
      const gridY = Math.floor(y / tileConfig.tileSize);

      // Check if the clicked position is within bounds and is a sand tile (0)
      if (
        gridX >= 0 &&
        gridX < tileConfig.mapWidth &&
        gridY >= 0 &&
        gridY < tileConfig.mapHeight &&
        mapGrid[gridY][gridX] === 0
      ) {
        game.addTower({ x: gridX, y: gridY });
      }
    },
    [game, gameCanvasRef, mapGrid]
  );

  return { addTower };
};
