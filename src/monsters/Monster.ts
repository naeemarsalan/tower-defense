import { Position } from "../types";

enum BodyPosition {
  DOWN = 0,
  UP = 1,
  LEFT = 2,
  RIGHT = 3,
}

export abstract class Monster {
  constructor(
    public position: Position,
    public nextPosition: Position,
    public health: number,
    public reward: number,

    protected speed: number,
    protected tileProgress: number,
    protected sprite: HTMLImageElement
  ) {}

  public abstract draw(ctx: CanvasRenderingContext2D): boolean;
  public abstract getExactPosition(): Position;

  protected getCurrentSpriteVariant(
    nextPosition: Position,
    currentPosition: Position
  ) {
    switch (true) {
      // Go right
      case nextPosition.x > currentPosition.x:
        return BodyPosition.RIGHT;
      // Go left
      case nextPosition.x < currentPosition.x:
        return BodyPosition.LEFT;
      // Go up
      case nextPosition.y < currentPosition.y:
        return BodyPosition.UP;
      // Go down
      case nextPosition.y > currentPosition.y:
        return BodyPosition.DOWN;
      default:
        throw new Error("Invalid body position");
    }
  }
}
