import { useCallback } from "react";
import { Game } from "../../../game/Game";
import { tileConfig } from "../../../constants";
import { TowerFactory, TowerType } from "../../../towers/TowerFactory";

interface Args {
  mapGrid: number[][];
  game: Game | null;
  gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  goldRef: React.MutableRefObject<number>;
  selectedTowerType: TowerType;
}

export const useAddTower = ({
  mapGrid,
  game,
  gameCanvasRef,
  goldRef,
  selectedTowerType,
}: Args) => {
  const canPlaceTower = useCallback(
    ({ x, y }: { x: number; y: number }) =>
      x >= 0 &&
      x < tileConfig.mapWidth &&
      y >= 0 &&
      y < tileConfig.mapHeight &&
      mapGrid[y][x] === 0,
    [mapGrid]
  );

  const placeTower = useCallback(
    ({ x, y }: { x: number; y: number }, towerType: TowerType) => {
      if (!game || !gameCanvasRef.current) return false;

      if (!canPlaceTower({ x, y })) return false;

      game.addTower(
        TowerFactory.createTower(towerType, { x, y }),
        goldRef.current
      );

      return true;
    },
    [canPlaceTower, game, gameCanvasRef, goldRef]
  );

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

      placeTower({ x: gridX, y: gridY }, selectedTowerType);
    },
    [game, gameCanvasRef, placeTower, selectedTowerType]
  );

  return { addTower, placeTower };
};
