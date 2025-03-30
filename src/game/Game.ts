import { Position } from "../types";
import { Vampire } from "../vampire/Vampire";
import { Tower } from "../towers/Tower";
import { Explosion } from "../effects/Explosion";
import { Level } from "../level/Level";
import { Monster } from "../monsters/Monster";

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
      onMonsterKilled: (reward: number) => void;
      onTowerBuilt: (cost: number) => void;
      onLivesLost: () => void;
    }
  ) {}

  public updatePath(newPath: Position[]): void {
    this.path = newPath;
  }

  public addTower(tower: Tower, gold: number) {
    // Check if tower already exists
    if (
      this.towers.find(
        (t) =>
          t.position.x === tower.position.x && t.position.y === tower.position.y
      )
    )
      return;

    // Check if player has enough gold
    if (gold < tower.cost) return;

    this.eventCallbacks.onTowerBuilt(tower.cost);

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
      }
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnMonster(): void {
    const vampire = new Vampire(this.path, 100, 10, 0.025);
    this.monsters.push(vampire);
    this.spawnedMonsters++;
    this.eventCallbacks.onMonsterSpawn();
  }

  private handleTowerAttacks(): void {
    this.towers.forEach((tower) => {
      this.monsters.forEach((monster) => {
        tower.attack(monster);
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

      // Monster is dead, add explosion and collect gold
      this.explosions.push(new Explosion(monster.getExactPosition()));
      this.eventCallbacks.onMonsterKilled(monster.reward);
      return false;
    });

    this.checkLevelEnd();

    this.monsters.forEach((monster) => {
      const hasReachedEnd = monster.draw(ctx);
      if (hasReachedEnd) {
        this.monsters = this.monsters.filter((m) => m !== monster);
        this.eventCallbacks.onLivesLost();
      }
    });
  }

  private drawExplosions(ctx: CanvasRenderingContext2D) {
    // Update and draw explosions
    this.explosions = this.explosions.filter((explosion) => {
      return explosion.runAnimation(ctx);
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

    this.towers.forEach((tower) => {
      tower.reset();
    });
  }
}
