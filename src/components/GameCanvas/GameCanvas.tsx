import { tileConfig } from "../../constants";
import { useRef } from "react";
import { Position } from "../../types";
import { useGameLoop } from "./hooks/useGameLoop";
import { useGameInit } from "./hooks/useGameInit";
import { useAddTower } from "./hooks/useAddTower";

interface Props {
  path: Position[];
  mapGrid: number[][];
  currentLevel: number;
}

export const GameCanvas = ({ path, currentLevel, mapGrid }: Props) => {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  const { game } = useGameInit(path, currentLevel);
  useGameLoop(game, gameCanvasRef?.current?.getContext("2d"));

  const { addTower } = useAddTower({ mapGrid, game, gameCanvasRef });

  return (
    <canvas
      ref={gameCanvasRef}
      width={tileConfig.mapWidth * tileConfig.tileSize}
      height={tileConfig.mapHeight * tileConfig.tileSize}
      style={{ position: "absolute", top: 0, left: 0 }}
      onClick={addTower}
    />
  );
};
