export class GameLoop {
  public onLoop: { (dt: number): void }[] = [];
  public onFixedLoop: { (dt: number): void }[] = [];
  private lastUpdate: number = 0;
  private lastFixedUpdate: number = 0;
  private start: number;

  public Start(): void {
    window.requestAnimationFrame(this.loop);
  }
  private loop(time: number): void {
    window.requestAnimationFrame(this.loop);
    if (this.start === undefined) {
      this.start = time;
    }
    const elapsed = time - this.start;
    this.onLoop.forEach((method) => method(elapsed - this.lastUpdate));
    this.lastUpdate = elapsed;
  }
}
