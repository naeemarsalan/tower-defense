import { useCallback, useEffect, useState } from "react";
import { Game } from "../../../game/Game";
import { usePathInit } from "../../MapCanvas/hooks/usePathInit";

export const useGameInit = (
  mapGrid: number[][],
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>
) => {
  const { path } = usePathInit(mapGrid);

  const [game, setGame] = useState<Game | null>(null);
  const [spawnedMonsters, setSpawnedMonsters] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleMonsterSpawn = useCallback(() => {
    setSpawnedMonsters((prev) => prev + 1);
  }, []);

  const handleGamePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Create game instance only once
  useEffect(() => {
    if (game) return;

    if (!path.length) return;

    const eventCallbacks = {
      onMonsterSpawn: handleMonsterSpawn,
      onGamePause: handleGamePause,
    };

    setGame(new Game(path, eventCallbacks));
  }, [handleMonsterSpawn, handleGamePause, path, game]); // Dependencies needed for callbacks

  // Update path when it changes
  useEffect(() => {
    if (!game || !path.length) return;
    game.updatePath(path);
  }, [game, path]);

  const continueGame = useCallback(
    (ctx: CanvasRenderingContext2D | null) => {
      if (!game) return;

      game.levelUp(ctx);
      setIsPaused(false);
      setCurrentLevel((prev) => prev + 1);
      setSpawnedMonsters(0);
    },
    [game, setCurrentLevel]
  );

  return { spawnedMonsters, game, isPaused, continueGame };
};
