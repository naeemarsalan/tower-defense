import { Position } from "../types";
import { Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";

export class Tower extends Sprite {
  public ready = false;
  public position: Position;
  public range = 1.5; // in tiles

  private lastAttackTime = 0;
  private attackCooldown = 2000; // 2 second between attacks

  public bullets: Bullet[] = [];

  constructor(position: Position) {
    super();
    this.position = position;
    this.sprite.src = "/tower.png"; // You'll need to add a tower sprite image
    this.sprite.onload = () => {
      this.ready = true;
    };
  }

  public isMonsterInRange(monster: Monster): boolean {
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
      const bullet = new Bullet({ ...this.position }, monster);
      this.bullets.push(bullet);
      this.lastAttackTime = currentTime;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.ready) return;

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

  private drawRangeIndicator(
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
}
