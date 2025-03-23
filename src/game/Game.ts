import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../tower/Tower";

export interface GameState {
  monsters: Monster[];
  towers: Tower[];
}

export class Game {
  public FPS = 10;

  private state: GameState;
  private path: Position[];

  private spawnInterval: number = 0; // Time between monster spawns in ms
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

    // Update bullets
    this.updateBullets();

    // Draw towers
    this.drawTowers(ctx);

    // Handle tower attacks
    this.handleTowerAttacks();
  }

  private spawnMonsters(): void {
    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      if (this.state.monsters.length < this.MAX_MONSTERS) {
        this.spawnVampire();
      }
      this.spawnInterval = 2000;
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
        const isAlive = bullet.update();
        if (!isAlive) {
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
      monster.draw(ctx);
    });
  }
}
