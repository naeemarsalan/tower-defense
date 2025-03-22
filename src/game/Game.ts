import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";

export interface GameState {
  monsters: Monster[];
}

export class Game {
  private state: GameState;
  private path: Position[];
  private spawnInterval: number = 0; // Time between monster spawns in ms
  private lastSpawnTime: number = 0;
  private MAX_MONSTERS = 2;

  constructor(path: Position[]) {
    this.path = path;
    this.state = {
      monsters: [],
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public tick(ctx: CanvasRenderingContext2D): void {
    // Spawn monsters
    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      if (this.state.monsters.length < this.MAX_MONSTERS) {
        this.spawnMonster();
      }
      this.spawnInterval = 2000;
      this.lastSpawnTime = currentTime;
    }

    // Draw monsters
    this.state.monsters.forEach((monster) => {
      monster.draw(ctx);
    });
  }

  private spawnMonster(): void {
    const vampire = new Vampire(this.path);
    this.state.monsters.push(vampire);
  }
}
