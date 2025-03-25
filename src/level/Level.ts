export class Level {
  public monstersToSpawn = 1;
  public spawnInterval = 2000;
  public background: HTMLImageElement;

  constructor(public difficulty: number) {
    this.background = new Image();
    this.background.src = "/map.png";
  }

  public updateLevel(): void {
    this.difficulty++;
    this.monstersToSpawn = 1 * this.difficulty;
    this.spawnInterval = 2000 / this.difficulty;
  }
}
