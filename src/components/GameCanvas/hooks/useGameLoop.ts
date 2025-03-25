import { useEffect } from "react";
import { Game } from "../../../game/Game";

const FPS = 16;
const TICK_INTERVAL = 1000 / FPS;

export const useGameLoop = (
  game: Game | null,
  ctx?: CanvasRenderingContext2D | null
) => {
  useEffect(() => {
    (() => {
      function main() {
        if (!game || !ctx) return;

        setTimeout(() => {
          window.requestAnimationFrame(main);
          game.tick(ctx);
        }, TICK_INTERVAL);
      }
      main(); // Start the cycle
    })();
  }, [game, ctx]);
};
