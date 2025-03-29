import { Position } from "../types";
import { tileConfig } from "../constants";

export class Explosion {
  public position: Position;

  private readonly sprite = new Image();
  private readonly frameCount = 8;
  private readonly frameDuration = 60; // milliseconds
  private currentFrame = 0;
  private lastFrameTime = 0;

  constructor(position: Position) {
    this.position = position;
    this.sprite.src = "/explosion/1.png"; // First frame
    this.lastFrameTime = performance.now();
  }

  public update(): boolean {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Update frame if enough time has passed
    if (deltaTime >= this.frameDuration) {
      this.currentFrame++;
      this.lastFrameTime = currentTime;

      // Load next frame
      if (this.currentFrame < this.frameCount) {
        this.sprite.src = `/explosion/${this.currentFrame + 1}.png`;
      } else {
        return false;
      }
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
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
