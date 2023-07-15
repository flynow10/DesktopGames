import { Canvas } from "@/core/canvas/internal";
import { Scene } from "@/core/canvas/internal";
import { Game, GameOptions } from "./Game";

export abstract class CanvasGame extends Game {
  private _canvas: Canvas | null = null;
  protected abstract _scene: Scene;
  public get canvas(): Canvas {
    if (this._canvas === null) {
      throw new Error("Canvas is not set!");
    }
    return this._canvas;
  }
  public pauseData: ImageData | null = null;

  constructor(options: Partial<GameOptions> = {}) {
    super(Object.assign({}, options, { drawWhenPaused: true }));
  }

  public draw(dt: number): void {
    this._canvas?.clearCommands();
    this._canvas?.reset();
    const canvasElement = this.canvas.canvas;
    canvasElement.width = canvasElement.offsetWidth;
    canvasElement.height = canvasElement.offsetHeight;
    if (this._scene !== null) {
      this._scene.draw(this.canvas, dt);
    }
  }

  private createCanvas(): [Canvas, HTMLCanvasElement] {
    const canvasElement = document.createElement("canvas");
    canvasElement.classList.add("w-full", "h-full");
    const canvas = new Canvas(canvasElement);
    return [canvas, canvasElement];
  }

  public attach(node: HTMLDivElement | null): void {
    if (node === null) {
      return;
    }
    const [canvas, canvasElement] = this.createCanvas();
    this._canvas = canvas;
    node.appendChild(canvasElement);
    this.canvas.onMouseDown.push((event) => {
      if (!this.paused) {
        this.mouseDown(event);
      }
    });
    this.canvas.onMouseUp.push((event) => {
      if (!this.paused) {
        this.mouseUp(event);
      }
    });
  }

  public mouseDown(event: MouseEvent) {}
  public mouseUp(event: MouseEvent) {}
}
