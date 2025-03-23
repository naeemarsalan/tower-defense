import { Position } from "../types";
import { Sprite } from "../sprite/Sprite";
import { tileConfig } from "../constants";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";

export class Tower extends Sprite {
  public position: Position;
  public ready = false;
  public range = 1.5;
  public damage = 1;
  private lastAttackTime = 0;
  private attackCooldown = 1000; // 0.1 second between attacks
  private bullets: Bullet[] = [];

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

    // Calculate Manhattan distance between tower and monster in tiles
    const dx = Math.abs(this.position.x - monster.position.x);
    const dy = Math.abs(this.position.y - monster.position.y);

    // Check if monster is within range (using Manhattan distance)
    return dx + dy <= this.range;
  }

  public attack(monster: Monster): void {
    const currentTime = performance.now();
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      // Create a new bullet starting from center of tower
      const bulletStartPosition = {
        x: this.position.x, // Center of tower
        y: this.position.y + 0.25, // Center of tower
      };
      const bullet = new Bullet(bulletStartPosition, monster.position);
      this.bullets.push(bullet);
      this.lastAttackTime = currentTime;
    }
  }

  public updateBullets(monsters: Monster[]): void {
    // Update all bullets
    this.bullets = this.bullets.filter((bullet) => {
      const isAlive = bullet.update();

      // Check for collisions with monsters
      if (isAlive) {
        monsters.forEach((monster) => {
          if (bullet.isBulletHittingMonster(monster)) {
            monster.health -= bullet.damage;
            return false; // Remove the bullet
          }
        });
      }

      return isAlive;
    });
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
