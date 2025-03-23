import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../tower/Tower";

export interface GameState {
  monsters: Monster[];
  towers: Tower[];
}

export class Game {
  public FPS = 16;

  private state: GameState;
  private path: Position[];

  // Time between monster spawns in ms
  private spawnInterval: number = 2000;
  private lastSpawnTime: number = 0;

  private MAX_MONSTERS = 1;

  constructor(path: Position[]) {
    this.path = path;
    this.state = {
      monsters: [],
      towers: [],
    };
  }

  public addTower(position: Position): void {
    const tower = new Tower(position);
    this.state.towers.push(tower);
  }

  public tick(ctx: CanvasRenderingContext2D | null): void {
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Spawn monsters
    this.spawnMonsters();

    // Draw monsters
    this.drawMonsters(ctx);

    // Draw towers
    this.drawTowers(ctx);

    // Handle tower attacks
    this.handleTowerAttacks();

    // Update bullets
    this.updateBullets();
  }

  private spawnMonsters(): void {
    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      if (this.state.monsters.length < this.MAX_MONSTERS) {
        this.spawnVampire();
      }
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnVampire(): void {
    const vampire = new Vampire(this.path);
    this.state.monsters.push(vampire);
  }

  private handleTowerAttacks(): void {
    this.state.towers.forEach((tower) => {
      this.state.monsters.forEach((monster) => {
        if (tower.isMonsterInRange(monster)) {
          tower.attack(monster);
        }
      });
    });
  }

  private updateBullets(): void {
    this.state.towers.forEach((tower) => {
      tower.bullets.forEach((bullet) => {
        const isActive = bullet.update();
        if (!isActive) {
          tower.bullets = tower.bullets.filter((b) => b !== bullet);
        }
      });
    });
  }

  private drawTowers(ctx: CanvasRenderingContext2D): void {
    this.state.towers.forEach((tower) => {
      tower.draw(ctx);
    });
  }

  private drawMonsters(ctx: CanvasRenderingContext2D): void {
    // Remove dead monsters
    this.state.monsters = this.state.monsters.filter(
      (monster) => monster.health > 0
    );

    this.state.monsters.forEach((monster) => {
      const hasReachedEnd = monster.draw(ctx);
      if (hasReachedEnd) {
        this.state.monsters = this.state.monsters.filter((m) => m !== monster);
      }
    });
  }
}
