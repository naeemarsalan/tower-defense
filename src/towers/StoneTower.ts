import { Position } from "../types";
import { Monster } from "../types";
import { Bullet } from "../bullet/Bullet";
import { Tower } from "./Tower";

export class StoneTower extends Tower {
  public bullets: Bullet[] = [];
  public bulletSprite = new Image();

  constructor(public position: Position) {
    super(position, new Image(), 1.5, 2000, 1);

    this.sprite.src = "/towers/stone/base.png";
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
}
