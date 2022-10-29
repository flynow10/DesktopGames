import { GameLoop } from "../GameLoop";

export abstract class Game {
  public static readonly Metadata: GameMetadata = {
    name: "Unknown",
    catagories: [],
  };
  public readonly gameLoop: GameLoop = new GameLoop();

  constructor() {
    this.gameLoop.onLoop.push(this.internalUpdate.bind(this));
    this.gameLoop.onFixedLoop.push(this.fixedUpdate.bind(this));
  }

  public start(): void {
    this.gameLoop.Start();
  }

  private internalUpdate(dt: number) {}
  public abstract draw(dt: number): void;
  public abstract update(dt: number): void;
  public fixedUpdate(dt: number): void {}
}

export type GameMetadata = {
  name: string;
  catagories: GameCatagories[];
};

export enum GameCatagories {
  OnePlayer,
  TwoPlayer,
  Strategy,
  Puzzle,
  Skill,
}
