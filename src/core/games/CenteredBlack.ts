import { Game, GameCatagories, GameMetadata } from "../Game";

export class CenteredBlack extends Game {
  public static Metadata: GameMetadata = {
    name: "Centered Black",
    catagories: [GameCatagories.OnePlayer, GameCatagories.Puzzle],
    componentType: "CenteredCanvas",
  };
  private _canvas: HTMLCanvasElement | null = null;

  private get canvas(): HTMLCanvasElement {
    if (this._canvas === null) {
      throw "Canvas is not set!";
    }
    return this._canvas;
  }

  private get ctx() {
    var ctx = this.canvas.getContext("2d");
    if (ctx === null) {
      throw "Failed to get canvas Context";
    }
    return ctx;
  }
  constructor() {
    super();
  }

  public draw(dt: number): void {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(
      "Width: " + this.canvas.width + "\nHeight: " + this.canvas.height,
      50,
      50
    );

    this.ctx.restore();
  }

  public update(dt: number): void {}

  public fixedUpdate(dt: number): void {}
  public attach(node: { canvasElement: HTMLCanvasElement }): void {
    this._canvas = node.canvasElement;
  }
}
