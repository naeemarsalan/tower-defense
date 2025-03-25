import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../tower/Tower";
import { Explosion } from "../effects/Explosion";
import { Level } from "../level/Level";

export interface GameState {
  monsters: Monster[];
  towers: Tower[];
}

export class Game {
  public FPS = 16;

  private state: GameState;
  private path: Position[];
  private explosions: Explosion[] = [];
  private lastSpawnTime: number = 0;

  public level: Level;
  public spawnedMonsters: number = 0;
  public isPaused: boolean = false;

  constructor(path: Position[]) {
    this.path = path;
    this.state = {
      monsters: [],
      towers: [],
    };
    this.level = new Level();
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

  private checkLevelEnd(): void {
    if (
      this.state.monsters.length === 0 &&
      this.spawnedMonsters === this.level.monstersToSpawn
    ) {
      this.isPaused = true;
    }
  }

  private spawnMonsters(): void {
    if (this.spawnedMonsters >= this.level.monstersToSpawn) return;

    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime >= this.level.spawnInterval) {
      if (this.state.monsters.length < this.level.monstersToSpawn) {
        this.spawnVampire();
        this.spawnedMonsters++;
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

    this.checkLevelEnd();

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
