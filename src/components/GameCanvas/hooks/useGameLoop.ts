import { useEffect } from "react";
import { Game } from "../../../game/Game";

const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

export const useGameLoop = (
  game: Game | null,
  ctx?: CanvasRenderingContext2D | null
) => {
  useEffect(() => {
    let lastFrameTime = 0;
    let animationFrameId: number;

    function gameLoop(timestamp: number) {
      if (!game || !ctx) return;

      const deltaTime = timestamp - lastFrameTime;
      if (deltaTime >= FRAME_TIME) {
        game.tick(ctx);
        lastFrameTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [game, ctx]);
};
