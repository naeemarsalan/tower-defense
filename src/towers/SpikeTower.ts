import { Position } from "../types";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";
import { Tower } from "./Tower";
import { tileConfig } from "../constants";

export class SpikeTower extends Tower {
  private shootingBulletOffset = 0;
  private reloadingBulletOffset = 16;

  public bullets: Bullet[] = [];

  public bulletSprite = new Image();
  private topSprite = new Image();
  private bottomSprite = new Image();

  constructor(public position: Position) {
    super(position, new Image(), 2.5, 2);

    this.sprite.src = "/towers/spike/base.png";
    this.bulletSprite.src = "/towers/spike/bullet.png";
    this.topSprite.src = "/towers/spike/top.png";
    this.bottomSprite.src = "/towers/spike/bottom.png";
  }

  protected createBullet(monster: Monster): Bullet {
    return new Bullet(
      { ...this.position },
      monster,
      20,
      0.2,
      this.bulletSprite
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
      162,
      186,
      posX + offset,
      posY + offset,
      scaledSize,
      scaledSize
    );

    ctx.drawImage(
      this.topSprite,
      0,
      0,
      162,
      186,
      posX + offset,
      this.isPreparingToShoot
        ? posY + offset + 16 - this.shootingBulletOffset
        : posY + offset + 16 - this.reloadingBulletOffset,
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
      this.isPreparingToShoot
        ? posY + offset + 22 - this.shootingBulletOffset
        : posY + offset + 22 - this.reloadingBulletOffset,
      scaledSize,
      scaledSize
    );

    // Calculate bullet size and center offset
    const bulletSize = tileConfig.tileSize * 0.2;
    const bulletOffset = (tileConfig.tileSize - bulletSize) / 2;

    if (this.isPreparingToShoot) {
      ctx.drawImage(
        this.bulletSprite,
        0,
        0,
        62,
        57,
        posX + bulletOffset,
        posY + offset + 16 - this.shootingBulletOffset,
        bulletSize,
        bulletSize
      );
    }

    // Draw bullets
    this.bullets.forEach((bullet) => bullet.draw(ctx));

    if (!this.isMonsterInRange) return;

    if (this.isPreparingToShoot) {
      this.shootingBulletOffset += 0.2 + this.shootingBulletOffset / 16;
      if (this.shootingBulletOffset > 16) {
        this.isPreparingToShoot = false;
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
    this.isPreparingToShoot = true;
    this.isCooldown = false;
    this.shootingBulletOffset = 0;
    this.reloadingBulletOffset = 16;
  }
}
