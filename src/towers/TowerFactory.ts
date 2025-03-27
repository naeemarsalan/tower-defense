import { Position } from "../types";
import { SpikeTower } from "./SpikeTower";
import { StoneTower } from "./StoneTower";
import { Tower } from "./Tower";

export enum TowerType {
  SPIKE = "SPIKE",
  STONE = "STONE",
}

export class TowerFactory {
  public static createTower(type: TowerType, position: Position): Tower {
    switch (type) {
      case TowerType.SPIKE:
        return new SpikeTower(position);
      case TowerType.STONE:
        return new StoneTower(position);
      default:
        throw new Error(`Unknown tower type: ${type}`);
    }
  }
}
