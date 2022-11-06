export class GameLoop {
  public onLoop: { (dt: number): void }[] = [];
  public onFixedLoop: { (dt: number): void }[] = [];
  private lastUpdate: number = 0;
  private lastFixedUpdate: number = 0;
  private _startTime: number = -1;
  private _stop: boolean = false;

  public start(): void {
    window.requestAnimationFrame((time) => {
      this.loop(time);
    });
  }

  public stop(): void {
    this._stop = true;
  }
  private loop(time: number): void {
    if (!this._stop) {
      window.requestAnimationFrame((time) => {
        this.loop(time);
      });
    }
    if (this._startTime === -1) {
      this._startTime = time;
    }
    const elapsed = time - this._startTime;
    this.onLoop.forEach((method) => method(elapsed - this.lastUpdate));
    this.lastUpdate = elapsed;
  }
}
