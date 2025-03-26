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
  const [gold, setGold] = useState(10);
  const [lives, setLives] = useState(3);

  // Create game instance only once
  useEffect(() => {
    // If game is already created, don't create it again
    if (game) return;

    // If path is not set, don't create game
    if (!path.length) return;

    const eventCallbacks = {
      onMonsterSpawn: () => setSpawnedMonsters((prev) => prev + 1),
      onGamePause: () => setIsPaused((prev) => !prev),
      onMonsterKilled: (reward: number) => setGold((prev) => prev + reward),
      onTowerBuilt: (cost: number) => setGold((prev) => prev - cost),
      onLivesLost: () => setLives((prev) => prev - 1),
    };

    setGame(new Game(path, eventCallbacks));
  }, [path, game]); // Dependencies needed for callbacks

  // Update path when it changes
  useEffect(() => {
    // If game is not created, don't update path
    if (!game || !path.length) return;

    // Update only path to preserve game state
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

  return {
    spawnedMonsters,
    game,
    isPaused,
    continueGame,
    gold,
    lives,
  };
};
