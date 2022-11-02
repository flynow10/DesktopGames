import { VNode, RendererNode, RendererElement } from "vue";
import { Game, GameCatagories, GameMetadata } from "./Game";

export class Game2 extends Game {
  public static Metadata: GameMetadata = {
    name: "Game2",
    catagories: [GameCatagories.OnePlayer],
    componentType: "CenteredCanvas",
  };
  constructor() {
    super();
  }

  public draw(dt: number): void {}

  public update(dt: number): void {}

  public cleanUp(): void {}

  public attach(el: RendererElement): void {}
}
