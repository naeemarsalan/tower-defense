import { Monster, Position } from "../types";
import { Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";

export class Bullet extends Sprite {
  public position: Position;
  public target: Position;
  public speed = 0.12;
  public damage = 1;
  public ready = false;

  constructor(start: Position, target: Position) {
    super();
    this.position = { ...start };
    this.target = target;
    this.sprite.src = "/bullet.png"; // You'll need to add a bullet sprite
    this.sprite.onload = () => {
      this.ready = true;
    };
  }

  public update(): boolean {
    // Calculate direction vector
    const dx = this.target.x - this.position.x;
    const dy = this.target.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Move bullet
    this.position.x += dirX * this.speed;
    this.position.y += dirY * this.speed;

    // Check if bullet has reached target (within 0.1 tiles)
    return distance > 0.1;
  }

  public isBulletHittingMonster(monster: Monster): boolean {
    if (!monster.position) return false;

    const dx = this.position.x - monster.position.x;
    const dy = this.position.y - monster.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Consider a hit if within 0.3 tiles
    return distance < 0.3;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.ready) return;

    console.log(this.position);

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
