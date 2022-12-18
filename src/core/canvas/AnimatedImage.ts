import { CanvasImage } from "./CanvasImage";

export class AnimatedImage {
  public canvas: HTMLCanvasElement = document.createElement("canvas");

  protected get context(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }

  public constructor(
    width: number,
    height: number,
    frame: ((image: CanvasImage, dt: number) => void) | null = null
  ) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
