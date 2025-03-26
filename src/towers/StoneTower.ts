import { Position } from "../types";
import { tileConfig } from "../constants";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";
import { Tower } from "./Tower";

export class StoneTower extends Tower {
  public bullets: Bullet[] = [];
  public bulletSprite: HTMLImageElement;

  constructor(public position: Position) {
    super(position, new Image(), 1.5, 2000, 1);

    this.sprite.src = "/towers/stone/base.png";

    this.bulletSprite = new Image();
    this.bulletSprite.src = "/towers/stone/bullet.png";
  }

  protected createBullet(monster: Monster): Bullet {
    return new Bullet(
      { ...this.position },
      monster,
      10,
      0.1,
      this.bulletSprite
    );
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
}
