import { tileConfig } from "../constants";
import { Position } from "../types";

enum BodyPosition {
  DOWN = 0,
  UP = 1,
  LEFT = 2,
  RIGHT = 3,
}

class Sprite {
  public readonly SPRITE_WIDTH = 64;
  public readonly SPRITE_HEIGHT = 64;
  public readonly TOTAL_FRAMES = 6;

  public sprite: HTMLImageElement;

  constructor() {
    this.sprite = new Image();
  }

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

export class Vampire extends Sprite {
  public health = 100;
  public currentSpriteFrame = 0; // Start with down direction

  constructor(public position: Position) {
    super();
    this.sprite.src = "/Vampires1_Walk_full.png";
  }

  updatePosition(newPosition: Position) {
    this.position = newPosition;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    nextPosition: Position,
    progress: number
  ) {
    // Determine which row of the sprite sheet to use based on movement direction
    // Returns BodyPosition enum value (0=DOWN, 1=UP, 2=LEFT, 3=RIGHT)
    const currentSpriteVariant = this.getCurrentSpriteVariant(
      nextPosition,
      this.position
    );

    // Calculate smooth position between tiles using linear interpolation (lerp)
    // progress = 0 -> vampire is at currentPosition
    // progress = 1 -> vampire is at nextPosition
    // progress between 0-1 -> vampire is between positions
    const posX =
      (this.position.x * (1 - progress) + nextPosition.x * progress) *
      tileConfig.tileSize;

    const posY =
      (this.position.y * (1 - progress) + nextPosition.y * progress) *
      tileConfig.tileSize;

    // Draw the vampire sprite:
    // - frame * SPRITE_WIDTH: selects which column (animation frame) from sprite sheet
    // - currentSprite * SPRITE_HEIGHT: selects which row (direction) from sprite sheet
    // - SPRITE_WIDTH/HEIGHT: size of one frame in the sprite sheet
    // - posX/posY: where to draw on the canvas
    ctx.drawImage(
      this.sprite,
      this.currentSpriteFrame * this.SPRITE_WIDTH,
      currentSpriteVariant * this.SPRITE_HEIGHT,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      posX,
      posY,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT
    );

    // Move to next frame in the walking animation
    this.currentSpriteFrame = (this.currentSpriteFrame + 1) % this.TOTAL_FRAMES;
  }
}
