import { GameLoop } from "./GameLoop";

export abstract class Game {
  public readonly gameLoop: GameLoop = new GameLoop();
  public onPause: (() => void)[] = [];
  public get paused(): boolean {
    return (
      this._gameOptions.isPauseable && (this._paused || !this._isTabVisible)
    );
  }
  protected set paused(value: boolean) {
    this._paused = value;
  }
  private _paused: boolean = false;
  private _isTabVisible: boolean = false;

  private _gameOptions: GameOptions;
  private documentBoundListeners: { [key: string]: (event: any) => void } = {
    keydown: this.internalKeyDown.bind(this),
    keyup: this.internalKeyUp.bind(this),
  };

  public constructor(options: Partial<GameOptions> = {}) {
    this._gameOptions = Object.assign({}, defaultOptions, options);
    this.gameLoop.fixedUpdateStep = this._gameOptions.fixedUpdateStep;
    this.gameLoop.onLoop.push(this.internalUpdate.bind(this));
    this.gameLoop.onFixedLoop.push(this.internalFixedUpdate.bind(this));
    for (const key in this.documentBoundListeners) {
      document.addEventListener(key, this.documentBoundListeners[key]);
    }
  }

  protected updateGameOptions(options: Partial<GameOptions>) {
    this._gameOptions = Object.assign({}, this._gameOptions, options);
    this.gameLoop.fixedUpdateStep = this._gameOptions.fixedUpdateStep;
  }

  public start(): void {
    this.gameLoop.start();
  }
  public selected(isSelected: boolean) {
    this._isTabVisible = isSelected;
  }
  private internalUpdate(dt: number) {
    if (!this.paused) {
      this.update(dt);
    }
    if (
      this._isTabVisible &&
      (this._gameOptions.drawWhenPaused || !this.paused)
    ) {
      this.draw(dt);
    }
  }
  public internalFixedUpdate(dt: number): void {
    if (!this.paused) {
      this.fixedUpdate(dt);
    }
  }
  public internalKeyDown(event: KeyboardEvent): void {
    if (this._isTabVisible) {
      if (this._gameOptions.isPauseable) {
        if (event.code === "Escape") {
          this.paused = !this.paused;
          for (const listener of this.onPause) {
            listener();
          }
          return;
        }
      }

      if (!this.paused) {
        if (event.code === "KeyR" && this._gameOptions.bindRestartKey) {
          this.restart();
          return;
        }
        this.keyDown(event);
      }
    }
  }
  public internalKeyUp(event: KeyboardEvent): void {
    if (!this.paused) {
      this.keyUp(event);
    }
  }
  public internalCleanup(): void {
    this.cleanup();
    this.gameLoop.stop();
    for (const key in this.documentBoundListeners) {
      document.removeEventListener(key, this.documentBoundListeners[key]);
    }
  }
  public abstract draw(dt: number): void;
  public abstract update(dt: number): void;
  public restart(): void {}
  public keyDown(event: KeyboardEvent): void {}
  public keyUp(event: KeyboardEvent): void {}
  public fixedUpdate(dt: number): void {}
  public cleanup(): void {}
}

export type GameOptions = {
  fixedUpdateStep: number;
  drawWhenPaused: boolean;
  bindRestartKey: boolean;
  isPauseable: boolean;
};

const defaultOptions: GameOptions = {
  fixedUpdateStep: (1 / 60) * 1000,
  drawWhenPaused: false,
  bindRestartKey: true,
  isPauseable: true,
};
