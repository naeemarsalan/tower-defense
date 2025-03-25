import { useEffect } from "react";
import { Game } from "../../../game/Game";

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
        }, 1000 / game.FPS);
      }
      main(); // Start the cycle
    })();
  }, [game, ctx]);
};
