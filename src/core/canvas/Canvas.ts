import { Vector } from "../utils/Vector";
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

  public onMouseDown: ((event: MouseEvent) => void)[] = [];
  public onMouseUp: ((event: MouseEvent) => void)[] = [];

  public readonly mouse: { pos: Vector; clickStart?: Vector; click: boolean } =
    {
      pos: Vector.zero(),
      clickStart: undefined,
      click: false,
    };

  constructor(canvas: HTMLCanvasElement) {
    super();
    this._canvas = canvas;
    this.initializeEventHandlers();
  }

  public initializeEventHandlers() {
    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse.pos = this.getMouseCoords(event);
    });
    this.canvas.addEventListener("mousedown", (event) => {
      this.mouse.click = true;
      var mouse = this.getMouseCoords(event);
      this.mouse.pos = mouse;
      this.mouse.clickStart = mouse;
      this.onMouseDown.forEach((listener) => {
        listener(event);
      });
    });
    this.canvas.addEventListener("mouseup", (event) => {
      this.mouse.click = false;
      this.mouse.pos = this.getMouseCoords(event);
      this.onMouseUp.forEach((listener) => {
        listener(event);
      });
      this.mouse.clickStart = undefined;
    });
  }

  private getMouseCoords(event: MouseEvent) {
    var rect = this.canvas.getBoundingClientRect();
    return new Vector(event.clientX - rect.left, event.clientY - rect.top);
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
