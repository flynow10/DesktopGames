import { Game, GameMetadata, GameCatagories } from "./Game";

export class Snake extends Game {
  public static Metadata: GameMetadata = {
    name: "Snake",
    catagories: [GameCatagories.OnePlayer, GameCatagories.Skill],
  };
  constructor() {
    super();
  }

  public draw(dt: number): void {}

  public update(dt: number): void {}

  public fixedUpdate(dt: number): void {}
}
