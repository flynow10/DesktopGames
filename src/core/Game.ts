import { GameLoop } from "./GameLoop";

export abstract class Game {
  public static readonly Metadata: GameMetadata = {
    name: "Unknown",
    catagories: [],
    componentType: "custom",
  };
  public readonly gameLoop: GameLoop = new GameLoop();
  protected get paused(): boolean {
    return this._paused || this._isTabVisible;
  }
  protected set paused(value: boolean) {
    this._paused = value;
  }
  private _paused: boolean = false;
  private _isTabVisible: boolean = false;

  public constructor() {
    this.gameLoop.onLoop.push(this.internalUpdate.bind(this));
    this.gameLoop.onFixedLoop.push(this.fixedUpdate.bind(this));
  }

  public start(): void {
    this.gameLoop.start();
  }
  public selected(isSelected: boolean) {
    this._isTabVisible = isSelected;
  }
  public abstract attach(node: any): void;
  private internalUpdate(dt: number) {
    this.update(dt);
    if (this._isTabVisible) {
      this.draw(dt);
    }
  }
  public abstract draw(dt: number): void;
  public abstract update(dt: number): void;
  public fixedUpdate(dt: number): void {}
  public internalCleanup(): void {
    this.cleanup();
    this.gameLoop.stop();
  }
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
