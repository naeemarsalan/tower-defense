import { Position } from "../types";
import { tileConfig } from "../constants";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";
import { Tower } from "./Tower";

export class SpikeTower extends Tower {
  public bullets: Bullet[] = [];
  public bulletSprite = new Image();

  constructor(public position: Position) {
    super(position, new Image(), 2.5, 3000, 2);

    this.sprite.src = "/towers/spike/base.png";
    this.bulletSprite.src = "/towers/spike/bullet.png";
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
