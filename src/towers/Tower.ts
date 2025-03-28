import { Position } from "../types";
import { tileConfig } from "../constants";
import { Monster } from "../monsters/Monster";
import { Bullet } from "../bullet/Bullet";

export abstract class Tower {
  public isPreparingToShoot = false;
  public isShooting = false;
  public isCooldown = false;

  public bullets: Bullet[] = [];

  constructor(
    public position: Position,
    protected sprite: HTMLImageElement,
    protected range: number,
    public cost: number
  ) {}

  protected abstract createBullet(monster: Monster): Bullet;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public abstract reset(): void;

  public attack(monster: Monster): void {
    if (!this.checkIsMonsterInRange(monster)) return;

    if (!this.isShooting) return;

    const bullet = this.createBullet(monster);
    this.bullets.push(bullet);

    this.isPreparingToShoot = false;
    this.isShooting = false;
    this.isCooldown = true;
  }

  protected drawRangeIndicator(
    ctx: CanvasRenderingContext2D,
    posX: number,
    posY: number
  ) {
    // Draw range indicator
    ctx.beginPath();
    ctx.arc(
      posX + tileConfig.tileSize / 2,
      posY + tileConfig.tileSize / 2,
      tileConfig.tileSize * this.range, // Radius to cover one cell in each direction
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0, 255, 0, 0.1)"; // Semi-transparent green
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
    ctx.stroke();
  }

  private checkIsMonsterInRange(monster: Monster) {
    if (!monster.position?.x || !monster.position?.y) return false;

    const dx = this.position.x - monster.getExactPosition().x;
    const dy = this.position.y - monster.getExactPosition().y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if any part of the monster is within range
    if (distance <= this.range) {
      this.isPreparingToShoot = true;
      return true;
    }

    return false;
  }
}
