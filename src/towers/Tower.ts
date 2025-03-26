import { Position } from "../types";
import { tileConfig } from "../constants";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";

export abstract class Tower {
  private lastAttackTime = 0;

  public bullets: Bullet[] = [];

  constructor(
    public position: Position,
    protected sprite: HTMLImageElement,
    protected range: number,
    protected attackCooldown: number,
    public cost: number
  ) {}

  protected abstract createBullet(monster: Monster): Bullet;

  protected abstract drawRangeIndicator(
    ctx: CanvasRenderingContext2D,
    posX: number,
    posY: number
  ): void;

  public isMonsterInRange(monster: Monster) {
    if (!monster.position?.x || !monster.position?.y) return false;

    const dx = this.position.x - monster.getExactPosition().x;
    const dy = this.position.y - monster.getExactPosition().y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if any part of the monster is within range
    return distance <= this.range;
  }

  public attack(monster: Monster): void {
    const currentTime = performance.now();
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      const bullet = this.createBullet(monster);
      this.bullets.push(bullet);
      this.lastAttackTime = currentTime;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const posX = this.position.x * tileConfig.tileSize;
    const posY = this.position.y * tileConfig.tileSize;

    // Draw range indicator
    this.drawRangeIndicator(ctx, posX, posY);

    // Scale down to 75% of tile size
    const scaledSize = tileConfig.tileSize * 0.7;
    // Center the tower in the cell
    const offset = (tileConfig.tileSize - scaledSize) / 2;

    ctx.drawImage(
      this.sprite,
      0,
      0,
      164,
      187,
      posX + offset,
      posY + offset,
      scaledSize,
      scaledSize
    );

    // Draw bullets
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}
