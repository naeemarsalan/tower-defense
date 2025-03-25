export class Level {
  public count = 1;
  public monstersToSpawn = 10;
  public spawnInterval = 2000;

  constructor() {}

  public updateLevel(): void {
    this.count++;
    this.monstersToSpawn = 10 * this.count;
    this.spawnInterval = 2000 / this.count;
  }
}
