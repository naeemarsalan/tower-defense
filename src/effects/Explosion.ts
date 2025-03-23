import { Position } from "../types";
import { Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";

export class Explosion extends Sprite {
  public ready = false;
  public position: Position;

  private currentFrame = 0;
  private readonly frameCount = 3;
  private readonly frameDuration = 120; // milliseconds
  private lastFrameTime = 0;

  constructor(position: Position) {
    super();
    this.position = position;
    this.sprite.src = "/explosions/1.png"; // First frame
    this.sprite.onload = () => {
      this.ready = true;
    };

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
        this.sprite.src = `/explosions/${this.currentFrame + 1}.png`;
      } else {
        return false;
      }
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.ready) return;

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
      104, // Source width
      109, // Source height
      centeredX,
      centeredY,
      explosionSize,
      explosionSize
    );
  }
}
