import { CanvasWrapper } from "./internal";

export class Canvas extends CanvasWrapper {
  private _canvas: HTMLCanvasElement;
  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public onRequireRedraw: (() => void)[] = [];
  public get context(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  constructor(canvas: HTMLCanvasElement) {
    super();
    this._canvas = canvas;
  }

  public forceRedraw(): void {
    this.onRequireRedraw.forEach((callback) => callback());
  }

  public getPauseImage(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  public setPauseImage(image: ImageData): void {
    this.context.putImageData(image, 0, 0);
  }

  public cleanup(): void {}
}
