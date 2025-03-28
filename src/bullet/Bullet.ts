import { Monster, Position } from "../types";
import { tileConfig } from "../constants";

export class Bullet {
  private speed = 0.2;
  private position: Position;
  private target: Monster;
  private damage: number;
  private sprite: HTMLImageElement;
  private spriteWidth: number;
  private spriteHeight: number;

  constructor(
    start: Position,
    target: Monster,
    damage: number,
    sprite: HTMLImageElement,
    spriteWidth: number,
    spriteHeight: number
  ) {
    this.position = start;
    this.target = target;
    this.sprite = sprite;
    this.damage = damage;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
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
    const posX = this.position.x * tileConfig.tileSize;
    const posY = this.position.y * tileConfig.tileSize;

    // Draw bullet (scaled to 20% of tile size)
    const bulletSize = tileConfig.tileSize * 0.2;

    // Center the bullet in the tile
    const centeredX = posX - bulletSize / 2 + tileConfig.tileSize / 2;
    const centeredY = posY - bulletSize / 2 + tileConfig.tileSize / 2;

    ctx.drawImage(
      this.sprite,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      centeredX,
      centeredY - 22,
      bulletSize,
      bulletSize
    );
  }
}
