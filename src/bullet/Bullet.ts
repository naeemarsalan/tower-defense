import { Monster, Position } from "../types";
import { Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";

export class Bullet extends Sprite {
  public ready = false;
  public position: Position;
  public target: Monster;
  public speed = 0.1;
  public damage = 10;

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
    const dx = this.target.getExactPosition().x - this.position.x;
    const dy = this.target.getExactPosition().y - this.position.y;
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

    // Draw bullet (scaled to 15% of tile size)
    const bulletSize = tileConfig.tileSize * 0.15;

    // Center the bullet in the tile
    const centeredX = posX - bulletSize / 2 + tileConfig.tileSize / 2;
    const centeredY = posY - bulletSize / 2 + tileConfig.tileSize / 2;

    ctx.drawImage(
      this.sprite,
      0,
      0,
      62, // Source width
      57, // Source height
      centeredX,
      centeredY,
      bulletSize,
      bulletSize
    );
  }
}
