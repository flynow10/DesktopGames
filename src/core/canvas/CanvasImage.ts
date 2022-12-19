import { CanvasWrapper } from "./internal";

export class CanvasImage extends CanvasWrapper {
  public canvas: HTMLCanvasElement = document.createElement("canvas");

  protected get context(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public constructor(
    width: number,
    height: number,
    setup: ((image: CanvasImage) => void) | null = null
  ) {
    super();
    this.canvas.width = width;
    this.canvas.height = height;
    if (setup !== null) {
      setup(this);
    }
  }
}
