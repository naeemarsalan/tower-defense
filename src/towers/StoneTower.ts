import { Position } from "../types";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";
import { Tower } from "./Tower";
import { tileConfig } from "../constants";

export class StoneTower extends Tower {
  private shootingBulletOffset = 0;
  private reloadingBulletOffset = 16;

  public bullets: Bullet[] = [];
  public bulletSprite = new Image();
  private topSprite = new Image();
  private bottomSprite = new Image();

  constructor(public position: Position) {
    super(position, new Image(), 2, 1);

    this.sprite.src = "/towers/stone/base.png";
    this.bulletSprite.src = "/towers/stone/bullet.png";
    this.topSprite.src = "/towers/stone/top.png";
    this.bottomSprite.src = "/towers/stone/bottom.png";
  }

  protected createBullet(monster: Monster): Bullet {
    return new Bullet(
      { ...this.position },
      monster,
      10,
      this.bulletSprite,
      160,
      148
    );
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

    const topPosY = this.isPreparingToShoot
      ? posY + offset + 16 - this.shootingBulletOffset
      : this.isCooldown
      ? posY + offset + 16 - this.reloadingBulletOffset
      : posY + offset + 16;

    const bottomPosY = this.isPreparingToShoot
      ? posY + offset + 22 - this.shootingBulletOffset
      : this.isCooldown
      ? posY + offset + 22 - this.reloadingBulletOffset
      : posY + offset + 22;

    ctx.drawImage(
      this.topSprite,
      0,
      0,
      162,
      186,
      posX + offset,
      topPosY,
      scaledSize,
      scaledSize
    );

    ctx.drawImage(
      this.bottomSprite,
      0,
      0,
      162,
      186,
      posX + offset,
      bottomPosY,
      scaledSize,
      scaledSize
    );

    // Calculate bullet size and center offset
    const bulletSize = tileConfig.tileSize * 0.2;
    const bulletOffset = (tileConfig.tileSize - bulletSize) / 2;

    if (!this.isCooldown) {
      ctx.drawImage(
        this.bulletSprite,
        0,
        0,
        160,
        148,
        posX + bulletOffset,
        posY + offset + 16 - this.shootingBulletOffset,
        bulletSize,
        bulletSize
      );
    }

    // Draw bullets
    this.bullets.forEach((bullet) => bullet.draw(ctx));

    if (!this.isPreparingToShoot && !this.isCooldown) return;

    if (this.isPreparingToShoot) {
      this.shootingBulletOffset += 0.2 + this.shootingBulletOffset / 16;
      if (this.shootingBulletOffset > 16) {
        this.isPreparingToShoot = false;
        this.isShooting = true;
        this.shootingBulletOffset = 0;
      }
    }

    if (this.isCooldown) {
      this.reloadingBulletOffset -= 2;
      if (this.reloadingBulletOffset < 0) {
        this.isCooldown = false;
        this.isPreparingToShoot = true;
        this.reloadingBulletOffset = 16;
      }
    }
  }

  public reset() {
    this.isPreparingToShoot = false;
    this.isCooldown = false;
    this.isShooting = false;
    this.shootingBulletOffset = 0;
    this.reloadingBulletOffset = 16;
  }
}
