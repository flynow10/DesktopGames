export class GameLoop {
  public onLoop: { (dt: number): void }[] = [];
  public onFixedLoop: { (dt: number): void }[] = [];
  private lastUpdate: number = 0;
  private lastFixedUpdate: number = 0;
  public fixedUpdateStep: number = 50;
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
    if (this._startTime === -1) {
      this._startTime = time;
    }
    const totalElapsed = time - this._startTime;
    this.onLoop.forEach((method) => method(totalElapsed - this.lastUpdate));
    if (this.lastFixedUpdate + this.fixedUpdateStep <= totalElapsed) {
      this.onFixedLoop.forEach((method) =>
        method(totalElapsed - this.lastFixedUpdate)
      );
      this.lastFixedUpdate = totalElapsed;
    }
    this.lastUpdate = totalElapsed;
    if (!this._stop) {
      window.requestAnimationFrame((time) => {
        this.loop(time);
      });
    }
  }
}
