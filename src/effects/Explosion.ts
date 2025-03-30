import { Position } from "../types";
import { tileConfig } from "../constants";

export class Explosion {
  public position: Position;
  private readonly sprite = new Image();

  private readonly FRAME_COUNT = 8;
  private readonly FRAME_DURATION = 60; // milliseconds
  private currentFrame = 0;
  private lastFrameTime = 0;

  constructor(position: Position) {
    this.position = position;
    this.sprite.src = "/explosion/1.png"; // First frame
    this.lastFrameTime = performance.now();
  }

  public runAnimation(ctx: CanvasRenderingContext2D): boolean {
    // Draw the current frame
    this.draw(ctx);

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Break early if not enough time has passed
    if (deltaTime < this.FRAME_DURATION) return true;

    this.currentFrame++;
    this.lastFrameTime = currentTime;

    // Load next frame
    if (this.currentFrame < this.FRAME_COUNT) {
      this.sprite.src = `/explosion/${this.currentFrame + 1}.png`;
      return true;
    }

    // Animation is complete
    return false;
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    const posX = this.position.x * tileConfig.tileSize;
    const posY = this.position.y * tileConfig.tileSize;

    // Draw explosion (scaled to 100% of tile size)
    const explosionSize = tileConfig.tileSize * 0.75;

    // Center the explosion in the tile
    const centeredX = posX - explosionSize / 2 + tileConfig.tileSize / 2;
    const centeredY = posY - explosionSize / 2 + tileConfig.tileSize / 2;

    ctx.drawImage(
      this.sprite,
      0,
      0,
      117, // Source width
      114, // Source height
      centeredX,
      centeredY,
      explosionSize,
      explosionSize
    );
  }
}
