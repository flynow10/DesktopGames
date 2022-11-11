import { GameLoop } from "./GameLoop";

export abstract class Game {
  public static readonly Metadata: GameMetadata = {
    name: "Unknown",
    catagories: [],
    componentType: "custom",
  };
  public readonly gameLoop: GameLoop = new GameLoop();
  protected get paused(): boolean {
    return this._paused || !this._isTabVisible;
  }
  protected set paused(value: boolean) {
    this._paused = value;
  }
  private _paused: boolean = false;
  private _isTabVisible: boolean = false;
  private _gameOptions: GameOptions;

  public constructor(options: Partial<GameOptions> = {}) {
    this._gameOptions = Object.assign({}, defaultOptions, options);
    this.gameLoop.fixedUpdateStep = this._gameOptions.fixedUpdateStep;
    this.gameLoop.onLoop.push(this.internalUpdate.bind(this));
    this.gameLoop.onFixedLoop.push(this.fixedUpdate.bind(this));
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
  public internalCleanup(): void {
    this.cleanup();
    this.gameLoop.stop();
  }
  public abstract attach(node: any): void;
  public abstract draw(dt: number): void;
  public abstract update(dt: number): void;
  public fixedUpdate(dt: number): void {}
  public cleanup(): void {}
}

export type GameMetadata = {
  name: string;
  catagories: GameCatagories[];
  componentType: GameComponentNames;
};

export type GameComponentNames =
  | "CenteredCanvas"
  | "FullscreenCanvas"
  | "custom";

export enum GameCatagories {
  OnePlayer,
  TwoPlayer,
  Strategy,
  Puzzle,
  Skill,
}

export type GameOptions = {
  fixedUpdateStep: number;
  drawWhenPaused: boolean;
};

const defaultOptions: GameOptions = {
  fixedUpdateStep: (1 / 60) * 1000,
  drawWhenPaused: false,
};
