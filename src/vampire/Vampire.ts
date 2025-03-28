import { tileConfig } from "../constants";
import { Monster } from "../monsters/Monster";
import { Position } from "../types";

export class Vampire extends Monster {
  private readonly SPRITE_WIDTH = 64;
  private readonly SPRITE_HEIGHT = 64;
  private readonly TOTAL_FRAMES = 6;

  private spriteFrame = 0; // Start with down direction
  private pathIndex = -1; // Start outside the map

  constructor(
    public path: Position[],
    health: number,
    reward: number,
    speed: number
  ) {
    super(
      { x: path[0].x, y: path[0].y - 1 }, // Start outside the map
      { x: path[0].x, y: path[0].y },
      health,
      reward,
      speed,
      0,
      new Image()
    );

    this.sprite.src = "/vampire.png";
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (
      this.nextPosition?.x === undefined ||
      this.nextPosition?.y === undefined
    ) {
      return true;
    }

    // Determine which row of the sprite sheet to use based on movement direction
    // Returns BodyPosition enum value (0=DOWN, 1=UP, 2=LEFT, 3=RIGHT)
    const currentSpriteVariant = this.getCurrentSpriteVariant(
      this.nextPosition,
      this.position
    );

    // Calculate smooth position between tiles using linear interpolation (lerp)
    // progress = 0 -> vampire is at currentPosition
    // progress = 1 -> vampire is at nextPosition
    // progress between 0-1 -> vampire is between positions
    const posX =
      (this.position.x * (1 - this.tileProgress) +
        this.nextPosition.x * this.tileProgress) *
      tileConfig.tileSize;

    const posY =
      (this.position.y * (1 - this.tileProgress) +
        this.nextPosition.y * this.tileProgress) *
      tileConfig.tileSize;

    // Draw the vampire sprite:
    // - frame * SPRITE_WIDTH: selects which column (animation frame) from sprite sheet
    // - currentSprite * SPRITE_HEIGHT: selects which row (direction) from sprite sheet
    // - SPRITE_WIDTH/HEIGHT: size of one frame in the sprite sheet
    // - posX/posY: where to draw on the canvas
    ctx.drawImage(
      this.sprite,
      this.spriteFrame * this.SPRITE_WIDTH,
      currentSpriteVariant * this.SPRITE_HEIGHT,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      posX,
      posY,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT
    );

    // Draw health bar
    this.drawHealthBar(ctx, posX, posY);

    // Move to next frame in the walking animation
    this.spriteFrame = (this.spriteFrame + 1) % this.TOTAL_FRAMES;

    // Move vampire closer to next tile
    this.tileProgress += this.speed;

    // When we reach the next tile (progress >= 1)
    // Reset progress and move to next tile in path
    if (this.tileProgress >= 1) {
      this.tileProgress = 0;
      this.pathIndex = Math.min(this.pathIndex + 1, this.path.length);
      this.position = this.path[this.pathIndex];
      this.nextPosition =
        this.pathIndex === this.path.length - 1
          ? {
              x: this.path[this.pathIndex].x,
              y: this.path[this.pathIndex].y + 1,
            }
          : this.path[Math.min(this.pathIndex + 1, this.path.length)];
    }

    return false;
  }

  private drawHealthBar(
    ctx: CanvasRenderingContext2D,
    posX: number,
    posY: number
  ) {
    // Draw health bar
    const healthBarWidth = this.SPRITE_WIDTH / 2;
    const healthBarHeight = 6;
    const healthBarY = posY + 5; // Position above the vampire's head
    const healthBarX = posX + (this.SPRITE_WIDTH - healthBarWidth) / 2; // Center the health bar

    // Draw health bar background (red)
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Draw current health (green)
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth * (this.health / 100),
      healthBarHeight
    );

    // Draw health bar border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
  }

  public getExactPosition(): Position {
    return {
      x:
        this.position.x +
        this.tileProgress * (this.nextPosition.x - this.position.x),
      y:
        this.position.y +
        this.tileProgress * (this.nextPosition.y - this.position.y),
    };
  }
}
