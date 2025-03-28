import { Position } from "../types";
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
}
