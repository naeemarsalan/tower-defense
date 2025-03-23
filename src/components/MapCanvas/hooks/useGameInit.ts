import { useEffect, useState } from "react";
import { Game } from "../../../game/Game";
import { Position } from "../../../types";

export const useGameInit = (path: Position[] | undefined) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!path) return;

    setGame(new Game(path));
  }, [path]);

  return { game };
};
