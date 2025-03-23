import { Monster, Position } from "../types";
import { BodyPosition, Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";

export class Bullet extends Sprite {
  public ready = false;
  public position: Position;
  public target: Monster;
  public speed = 0.2;
  public damage = 5;

  constructor(start: Position, target: Monster) {
    super();
    this.position = start;
    this.target = target;
    this.sprite.src = "/bullet.png"; // You'll need to add a bullet sprite
    this.sprite.onload = () => {
      this.ready = true;
    };
  }

  public update(): boolean {
    const isMonsterMovingRight =
      this.target.getBodyPosition() === BodyPosition.RIGHT;
    const isMonsterMovingLeft =
      this.target.getBodyPosition() === BodyPosition.LEFT;
    const isMonsterMovingDown =
      this.target.getBodyPosition() === BodyPosition.DOWN;
    const isMonsterMovingUp = this.target.getBodyPosition() === BodyPosition.UP;

    const getTargetPositionX = () => {
      if (isMonsterMovingRight) {
        return this.target.position.x + this.target.tileProgress;
      }

      if (isMonsterMovingLeft) {
        return this.target.position.x - this.target.tileProgress;
      }

      return this.target.position.x;
    };

    const getTargetPositionY = () => {
      if (isMonsterMovingDown) {
        return this.target.position.y + this.target.tileProgress;
      }

      if (isMonsterMovingUp) {
        return this.target.position.y - this.target.tileProgress;
      }

      return this.target.position.y + 0.5;
    };

    const dx = getTargetPositionX() - this.position.x;
    const dy = getTargetPositionY() - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Move bullet
    this.position.x += dirX * this.speed;
    this.position.y += dirY * this.speed;

    // Check if bullet has reached target (within 0.1 tiles)
    const hasReachedTarget = distance <= 0.2;
    if (!hasReachedTarget) return true;

    this.target.health -= this.damage;
    return false; // Remove the bullet
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.ready) return;

    const posX = this.position.x * tileConfig.tileSize;
    const posY = this.position.y * tileConfig.tileSize;

    // Draw bullet (scaled to 25% of tile size)
    const bulletSize = tileConfig.tileSize * 0.15;
    ctx.drawImage(
      this.sprite,
      0,
      0,
      62, // Source width
      57, // Source height
      posX - bulletSize / 2 + 32,
      posY - bulletSize / 2,
      bulletSize,
      bulletSize
    );
  }
}
