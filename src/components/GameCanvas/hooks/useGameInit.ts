import { useEffect, useState } from "react";
import { Game } from "../../../game/Game";
import { Position } from "../../../types";

export const useGameInit = (path: Position[], currentLevel: number) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!path.length) return;

    setGame(new Game(path, currentLevel));
  }, [path, currentLevel]);

  return { game };
};
