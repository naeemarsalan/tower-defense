export interface Position {
  x: number;
  y: number;
}

export interface Monster {
  id: string;

  position: Position;
  nextPosition: Position;
  tileProgress: number;

  health: number;
  speed: number;

  draw(ctx: CanvasRenderingContext2D): boolean;
  getExactPosition(): Position;
}
