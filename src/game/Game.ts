import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../tower/Tower";
import { Explosion } from "../effects/Explosion";

export interface GameState {
  monsters: Monster[];
  towers: Tower[];
  level: number;
}

export class Game {
  public FPS = 16;

  private state: GameState;
  private path: Position[];
  private explosions: Explosion[] = [];

  private spawnInterval: number; // Time between monster spawns in ms
  private lastSpawnTime: number = 0;

  public monstersToSpawn: number;

  constructor(path: Position[]) {
    this.path = path;
    this.state = {
      monsters: [],
      towers: [],
      level: 1,
    };
    this.spawnInterval = 2000 / this.state.level;
    this.monstersToSpawn = 10 * this.state.level;
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

    // Update and draw explosions
    this.drawExplosions(ctx);

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
      if (this.state.monsters.length < this.monstersToSpawn) {
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
    this.state.monsters = this.state.monsters.filter((monster) => {
      if (monster.health > 0) {
        return true;
      }

      this.explosions.push(new Explosion(monster.getExactPosition()));
      return false;
    });

    this.state.monsters.forEach((monster) => {
      const hasReachedEnd = monster.draw(ctx);
      if (hasReachedEnd) {
        this.state.monsters = this.state.monsters.filter((m) => m !== monster);
      }
    });
  }

  private drawExplosions(ctx: CanvasRenderingContext2D) {
    // Update and draw explosions
    this.explosions = this.explosions.filter((explosion) => {
      const isRunning = explosion.update();
      if (isRunning) {
        explosion.draw(ctx);
      }
      return isRunning;
    });
  }
}
