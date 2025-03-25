import { Monster, Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../tower/Tower";
import { Explosion } from "../effects/Explosion";
import { Level } from "../level/Level";

export class Game {
  private monsters: Monster[] = [];
  private towers: Tower[] = [];
  private explosions: Explosion[] = [];

  private level: Level = new Level(1);
  private spawnedMonsters: number = 0;
  private lastSpawnTime: number = 0;

  private isPaused = false;

  constructor(
    private path: Position[],
    private eventCallbacks: {
      onMonsterSpawn: () => void;
      onGamePause: () => void;
    }
  ) {}

  public updatePath(newPath: Position[]): void {
    this.path = newPath;
  }

  public addTower(position: Position) {
    // Check if tower already exists
    if (
      this.towers.find(
        (tower) =>
          tower.position.x === position.x && tower.position.y === position.y
      )
    )
      return;

    const tower = new Tower(position);
    this.towers.push(tower);
  }

  public tick(ctx: CanvasRenderingContext2D | null): void {
    if (!ctx) return;

    if (this.isPaused) return;

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
      this.monsters.length === 0 &&
      this.spawnedMonsters === this.level.monstersToSpawn &&
      this.explosions.length === 0 &&
      this.towers.every((tower) => tower.bullets.length === 0)
    ) {
      this.isPaused = true;
      this.eventCallbacks.onGamePause();
    }
  }

  private spawnMonsters(): void {
    if (this.spawnedMonsters >= this.level.monstersToSpawn) return;

    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime >= this.level.spawnInterval) {
      if (this.monsters.length < this.level.monstersToSpawn) {
        this.spawnMonster();
        this.spawnedMonsters++;
        this.eventCallbacks.onMonsterSpawn();
      }
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnMonster(): void {
    const vampire = new Vampire(this.path);
    this.monsters.push(vampire);
  }

  private handleTowerAttacks(): void {
    this.towers.forEach((tower) => {
      this.monsters.forEach((monster) => {
        if (tower.isMonsterInRange(monster)) {
          tower.attack(monster);
        }
      });
    });
  }

  private updateBullets(): void {
    this.towers.forEach((tower) => {
      tower.bullets.forEach((bullet) => {
        const isAlive = bullet.update();
        if (!isAlive) {
          tower.bullets = tower.bullets.filter((b) => b !== bullet);
        }
      });
    });
  }

  private drawTowers(ctx: CanvasRenderingContext2D): void {
    this.towers.forEach((tower) => {
      tower.draw(ctx);
    });
  }

  private drawMonsters(ctx: CanvasRenderingContext2D): void {
    // Remove dead monsters
    this.monsters = this.monsters.filter((monster) => {
      if (monster.health > 0) return true;

      this.explosions.push(new Explosion(monster.getExactPosition()));
      return false;
    });

    this.checkLevelEnd();

    this.monsters.forEach((monster) => {
      const hasReachedEnd = monster.draw(ctx);
      if (hasReachedEnd) {
        this.monsters = this.monsters.filter((m) => m !== monster);
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

  public levelUp(ctx: CanvasRenderingContext2D | null): void {
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.level.updateLevel();

    // Reset game state
    this.spawnedMonsters = 0;
    this.lastSpawnTime = 0;
    this.isPaused = false;
  }
}
