export interface Position {
  x: number;
  y: number;
}

export interface Monster {
  id: string;
  position: Position;
  health: number;
  speed: number;
  tileProgress: number; // Progress along the path (0 to 1)
  draw: (ctx: CanvasRenderingContext2D) => void;
}
